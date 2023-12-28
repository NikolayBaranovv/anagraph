import type { DrawingInstruction } from "../drawing-types";
import { assertNever } from "../../lib/utils";
import { MainToWorkerMessage, statsReportMessage } from "./worker-messages";
import { drawInstruction } from "./drawers";
import { Bounds } from "../../lib/basic-types";

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

function drawLatestInstructions() {
    if (!canvas || !ctx) return;

    // console.groupCollapsed("draw");
    for (const instruction of latestInstructions) {
        // console.log(instruction.type);
        drawInstruction(instruction, ctx, xBounds, devicePixelRatio);
    }
    // console.groupEnd();
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
