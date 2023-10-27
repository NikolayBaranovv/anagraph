import type { Bounds, DrawingInstruction } from "./drawing-types";
import { visualDownsample_B } from "./downsample";
import { assertNever, generateTicks, generateTimeTicks, scale } from "./utils";
import { MainToWorkerMessage, statsReportMessage } from "./worker-messages";

let devicePixelRatio = 1;
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

function setCanvasSize(width: number, height: number): void {
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
}

let latestInstructions: DrawingInstruction[] = [];
let xBounds: Bounds = [0, 1];
let drawPlanned = false;

let lastTimerTime = 0;
let framesDrawn = 0;

function yLabel(y: number): string {
    return y.toFixed(1);
}

function timeXLabel(x: number, prevX: number | null): string[] {
    const dt = new Date(x);
    const prev_dt = prevX == null ? null : new Date(prevX);
    if (
        prev_dt != null &&
        prev_dt.getFullYear() == dt.getFullYear() &&
        prev_dt.getMonth() == dt.getMonth() &&
        prev_dt.getDate() == dt.getDate()
    ) {
        return [`${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`];
    } else {
        return [
            `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`,
            `${dt.getDate().toString().padStart(2, "0")}.${(dt.getMonth() + 1)
                .toString()
                .padStart(2, "0")}.${dt.getFullYear()}`,
        ];
    }
}

function drawLatestInstructions() {
    if (!canvas || !ctx) return;

    for (const instruction of latestInstructions) {
        ctx.save();
        switch (instruction.type) {
            case "clearBackground": {
                const { width, height, color } = instruction;
                if (color == null) {
                    ctx.clearRect(0, 0, width, height);
                } else {
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, width, height);
                }
                break;
            }

            case "drawGrid": {
                const { color, lineWidth, gridRect, yBounds } = instruction;

                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;

                for (const y of generateTicks(yBounds, gridRect.height, 50)) {
                    const ypx = Math.round(scale(y, yBounds, [gridRect.y, gridRect.y + gridRect.height])) + 0.5;
                    ctx.beginPath();
                    ctx.moveTo(gridRect.x, ypx);
                    ctx.lineTo(gridRect.x + gridRect.width, ypx);
                    ctx.stroke();
                }

                for (const x of generateTimeTicks(xBounds, gridRect.width, 60e3 / 10)) {
                    const xpx = Math.round(scale(x, xBounds, [gridRect.x, gridRect.x + gridRect.width])) + 0.5;
                    ctx.beginPath();
                    ctx.moveTo(xpx, gridRect.y);
                    ctx.lineTo(xpx, gridRect.y + gridRect.height);
                    ctx.stroke();
                }

                break;
            }

            case "drawYLegend": {
                const { labelSettings, yBounds, gridRect } = instruction;

                ctx.fillStyle = labelSettings.textColor;
                ctx.font = `${labelSettings.fontStyle} ${labelSettings.fontSize * devicePixelRatio}px ${
                    labelSettings.fontFamily
                }`;
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";

                for (const y of generateTicks(yBounds, gridRect.height, labelSettings.yLabelsHeight)) {
                    const ypx = Math.round(scale(y, yBounds, [gridRect.y + gridRect.height, gridRect.y]));
                    ctx.fillRect(
                        gridRect.x - labelSettings.bulletRadius,
                        ypx - labelSettings.bulletRadius,
                        labelSettings.bulletRadius * 2,
                        labelSettings.bulletRadius * 2,
                    );

                    const text = yLabel(y);
                    const x = gridRect.x - labelSettings.yLabelsGap;
                    ctx.fillText(text, x, ypx);
                }

                break;
            }

            case "drawTimeXLegend": {
                const { labelSettings, gridRect } = instruction;

                ctx.fillStyle = labelSettings.textColor;
                ctx.textBaseline = "top";
                ctx.font = `${labelSettings.fontStyle} ${labelSettings.fontSize * devicePixelRatio}px ${
                    labelSettings.fontFamily
                }`;

                const sampleSize = ctx.measureText("00:00");

                let prevX: number | null = null;

                for (const x of generateTimeTicks(
                    xBounds,
                    gridRect.width,
                    (sampleSize.width / gridRect.width) * (xBounds[1] - xBounds[0]) * 1.3,
                )) {
                    const xpx = Math.round(scale(x, xBounds, [gridRect.x, gridRect.x + gridRect.width]));
                    ctx.fillRect(
                        xpx - labelSettings.bulletRadius,
                        gridRect.y + gridRect.height - labelSettings.bulletRadius,
                        labelSettings.bulletRadius * 2,
                        labelSettings.bulletRadius * 2,
                    );

                    const text = timeXLabel(x, prevX);
                    prevX = x;

                    let y = gridRect.y + gridRect.height + labelSettings.xLabelsGap;
                    for (let i = 0, len = text.length; i < len; i++) {
                        const line = text[i];
                        const measure: TextMetrics = ctx.measureText(line);
                        ctx.fillText(line, xpx - measure.width / 2, y);
                        y += measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent;
                    }
                }
                break;
            }

            case "drawLine": {
                const {
                    points,
                    color,
                    gridRect,
                    yBounds: [yMin, yMax],
                    lineWidth,
                } = instruction;

                const downsampled_B = visualDownsample_B(points, xBounds, gridRect.width);
                const downX = downsampled_B[0],
                    downY = downsampled_B[1];

                if (downX.length === 0) break;

                ctx.lineWidth = lineWidth * devicePixelRatio;
                ctx.lineCap = "square";
                ctx.lineJoin = "bevel";
                ctx.strokeStyle = color;

                const clipPath = new Path2D();
                clipPath.rect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);
                ctx.clip(clipPath);

                const { 0: xMin, 1: xMax } = xBounds;
                const { x: gridRectX, y: gridRectY, width: gridRectWidth, height: gridRectHeight } = gridRect;
                const gridBottom = gridRectY + gridRectHeight;
                const gridWidthDivXBounds = gridRectWidth / (xMax - xMin);
                const gridHeightDivYBounds = gridRectHeight / (yMax - yMin);
                // Math.round() is here because canvas is faster with integer coordinates
                for (let i = 0, len = downX.length; i < len; i++) {
                    downX[i] = Math.round((downX[i] - xMin) * gridWidthDivXBounds + gridRectX);
                }
                for (let i = 0, len = downY.length; i < len; i++) {
                    const y = downY[i];
                    downY[i] = y == null ? null : Math.round(gridBottom - (y - yMin) * gridHeightDivYBounds);
                }

                ctx.beginPath();
                let penDown = false;
                for (let i = 0; i < downX.length; i++) {
                    const x = downX[i],
                        y = downY[i];
                    if (y == null) {
                        penDown = false;
                        continue;
                    }
                    if (!penDown) {
                        ctx.moveTo(x, y);
                        penDown = true;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

function setInstructions(instructions: DrawingInstruction[]) {
    latestInstructions = instructions;
}

function setXBoundsAndRedraw(xBounds_: Bounds) {
    xBounds = xBounds_;
    if (!drawPlanned) {
        drawPlanned = true;
        requestAnimationFrame(() => {
            drawLatestInstructions();
            framesDrawn++;
            drawPlanned = false;
        });
    }
}

export function startAnagraphWorker() {
    setInterval(() => {
        const now = new Date().getTime();
        const fps = (framesDrawn / (now - lastTimerTime)) * 1e3;
        lastTimerTime = now;
        framesDrawn = 0;
        postMessage(statsReportMessage(fps));
    }, 1e3);

    addEventListener("message", (msg: MessageEvent<MainToWorkerMessage>) => {
        const type = msg.data.type;

        switch (msg.data.type) {
            case "setCanvas": {
                canvas = msg.data.canvas;
                ctx = canvas?.getContext("2d", { desynchronized: true }) ?? null;
                devicePixelRatio = msg.data.devicePixelRatio;
                break;
            }

            case "setCanvasSize": {
                setCanvasSize(msg.data.width, msg.data.height);
                break;
            }

            case "setInstructions": {
                setInstructions(msg.data.instructions);
                break;
            }

            case "setXBoundsAndRedraw": {
                setXBoundsAndRedraw(msg.data.xBounds);
                break;
            }

            default: {
                assertNever(msg.data);
            }
        }
    });
}
