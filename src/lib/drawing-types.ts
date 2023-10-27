import { LabelSettings } from "./LayoutManager";

export type Bounds = Readonly<[number, number]>;

export type GraphData = [number, number][];

export interface Size {
    width: number;
    height: number;
}

export interface Offset {
    x: number;
    y: number;
}

export type Rect = Offset & Size;

export type DrawingInstruction =
    | ClearBackgroundInstruction
    | DrawLineInstruction
    | DrawGridInstruction
    | DrawYLegendInstruction
    | DrawTimeXLegendInstruction;

interface ClearBackgroundInstruction {
    type: "clearBackground";
    width: number;
    height: number;
    color: string | null;
}

export function clearBackgroundInstruction(
    width: number,
    height: number,
    color: string | null,
): ClearBackgroundInstruction {
    return { type: "clearBackground", width, height, color };
}

interface DrawLineInstruction {
    type: "drawLine";
    points: GraphData;
    color: string;
    gridRect: Rect;
    yBounds: Bounds;
    lineWidth: number;
}

export function drawLineInstruction(
    points: GraphData,
    color: string,
    gridRect: Rect,
    yBounds: Bounds,
    lineWidth: number,
): DrawLineInstruction {
    return { type: "drawLine", points, color, gridRect, yBounds, lineWidth };
}

interface DrawGridInstruction {
    type: "drawGrid";
    color: string;
    lineWidth: number;
    gridRect: Rect;
    yBounds: Bounds;
}

export function drawGridInstruction(
    color: string,
    lineWidth: number,
    gridRect: Rect,
    yBounds: Bounds,
): DrawGridInstruction {
    return { type: "drawGrid", color, lineWidth, gridRect, yBounds };
}

interface DrawYLegendInstruction {
    type: "drawYLegend";
    labelSettings: LabelSettings;
    gridRect: Rect;
    yBounds: Bounds;
}

export function drawYLegendInstruction(
    labelSettings: LabelSettings,
    gridRect: Rect,
    yBounds: Bounds,
): DrawYLegendInstruction {
    return { type: "drawYLegend", labelSettings, gridRect, yBounds };
}

interface DrawTimeXLegendInstruction {
    type: "drawTimeXLegend";
    labelSettings: LabelSettings;
    gridRect: Rect;
}

export function drawTimeXLegendInstruction(labelSettings: LabelSettings, gridRect: Rect): DrawTimeXLegendInstruction {
    return { type: "drawTimeXLegend", labelSettings, gridRect };
}
