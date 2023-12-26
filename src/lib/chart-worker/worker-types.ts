import { ChartSettings } from "../settings-types";
import { Bounds } from "../basic-types";
import { LineId, LineInfo } from "./chart-worker-messages";

export interface DrawContext {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    devicePixelRatio: number;
}

export interface ChartInfo {
    settings: ChartSettings;
    xBounds: Bounds;
    lines: Map<LineId, LineInfo>;
}
