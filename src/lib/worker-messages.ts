import { Bounds, DrawingInstruction } from "./drawing-types";

export type MainToWorkerMessage =
    | SetCanvasMessage
    | SetCanvasSizeMessage
    | SetInstructionsMessage
    | SetXBoundsAndRedrawMessage;

export type WorkerToMainMessage = StatsReport;

interface SetCanvasMessage {
    type: "setCanvas";
    canvas: OffscreenCanvas;
    devicePixelRatio: number;
}

export function setCanvasMessage(canvas: OffscreenCanvas, devicePixelRatio: number): SetCanvasMessage {
    return { type: "setCanvas", canvas, devicePixelRatio };
}

interface SetCanvasSizeMessage {
    type: "setCanvasSize";
    width: number;
    height: number;
}

export function setCanvasSizeMessage(width: number, height: number): SetCanvasSizeMessage {
    return { type: "setCanvasSize", width, height };
}

interface SetInstructionsMessage {
    type: "setInstructions";
    instructions: DrawingInstruction[];
}

export function setInstructionsMessage(instructions: DrawingInstruction[]): SetInstructionsMessage {
    return { type: "setInstructions", instructions };
}

interface SetXBoundsAndRedrawMessage {
    type: "setXBoundsAndRedraw";
    xBounds: Bounds;
}

export function setXBoundsAndRedrawMessage(xBounds: Bounds): SetXBoundsAndRedrawMessage {
    return { type: "setXBoundsAndRedraw", xBounds };
}

interface StatsReport {
    type: "stats";
    fps: number;
}

export function statsReportMessage(fps: number): StatsReport {
    return { type: "stats", fps };
}
