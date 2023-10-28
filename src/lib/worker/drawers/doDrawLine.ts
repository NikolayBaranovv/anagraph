import { Bounds, DrawLineInstruction } from "../../drawing-types";
import { visualDownsample, visualDownsample_B } from "../../downsample";

export function doDrawLine(
    instruction: DrawLineInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    xBounds: Bounds,
    devicePixelRatio: number,
): void {
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

    if (downX.length === 0) return;

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
