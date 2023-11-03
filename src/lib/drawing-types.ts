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
    | DrawVerticalFillingInstruction
    | DrawXGridInstruction
    | DrawYGridInstruction
    | DrawYLegendInstruction
    | DrawTimeXLegendInstruction;

export interface ClearBackgroundInstruction {
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

export interface DrawLineInstruction {
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

export interface DrawVerticalFillingInstruction {
    type: "drawVerticalFilling";
    intervals: Bounds[];
    color: string;
    gridRect: Rect;
}

export function drawVerticalFillingInstruction(
    intervals: Bounds[],
    color: string,
    gridRect: Rect,
): DrawVerticalFillingInstruction {
    return { type: "drawVerticalFilling", intervals, color, gridRect };
}

export interface DrawXGridInstruction {
    type: "drawTimeXGrid";
    color: string;
    lineWidth: number;
    gridRect: Rect;
    labelSettings: LabelSettings;
}

export function drawTimeXGridInstruction(
    color: string,
    lineWidth: number,
    gridRect: Rect,
    labelSettings: LabelSettings,
): DrawXGridInstruction {
    return { type: "drawTimeXGrid", color, lineWidth, gridRect, labelSettings };
}

export interface DrawYGridInstruction {
    type: "drawYGrid";
    color: string;
    lineWidth: number;
    gridRect: Rect;
    yBounds: Bounds;
}

export function drawYGridInstruction(
    color: string,
    lineWidth: number,
    gridRect: Rect,
    yBounds: Bounds,
): DrawYGridInstruction {
    return { type: "drawYGrid", color, lineWidth, gridRect, yBounds };
}

export interface DrawYLegendInstruction {
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

export interface DrawTimeXLegendInstruction {
    type: "drawTimeXLegend";
    labelSettings: LabelSettings;
    gridRect: Rect;
}

export function drawTimeXLegendInstruction(labelSettings: LabelSettings, gridRect: Rect): DrawTimeXLegendInstruction {
    return { type: "drawTimeXLegend", labelSettings, gridRect };
}
