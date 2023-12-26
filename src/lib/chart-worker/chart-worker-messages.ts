import { Bounds, LineData } from "../basic-types";
import { ChartSettings } from "../settings-types";

export type MainToChartWorkerMessage =
    | SetCanvasMessage
    | SetCanvasSizeMessage
    | SetDevicePixelRatioMessage
    | SetXBoundsAndRedrawMessage
    | SetChartSettingsMessage
    | AddLineMessage
    | ChangeLineMessage
    | RemoveLineMessage;

interface SetCanvasMessage {
    type: "setCanvas";
    canvas: OffscreenCanvas;
    devicePixelRatio: number;
}

interface SetDevicePixelRatioMessage {
    type: "setDevicePixelRatio";
    devicePixelRatio: number;
}

export function setCanvasMessage(canvas: OffscreenCanvas, devicePixelRatio: number): SetCanvasMessage {
    return { type: "setCanvas", canvas, devicePixelRatio };
}

export function setDevicePixelRatioMessage(devicePixelRatio: number): SetDevicePixelRatioMessage {
    return { type: "setDevicePixelRatio", devicePixelRatio };
}

interface SetCanvasSizeMessage {
    type: "setCanvasSize";
    width: number;
    height: number;
}

export function setCanvasSizeMessage(width: number, height: number): SetCanvasSizeMessage {
    return { type: "setCanvasSize", width, height };
}

interface SetXBoundsAndRedrawMessage {
    type: "setXBoundsAndRedraw";
    xBounds: Bounds;
}

export function setXBoundsAndRedrawMessage(xBounds: Bounds): SetXBoundsAndRedrawMessage {
    return { type: "setXBoundsAndRedraw", xBounds };
}

interface SetChartSettingsMessage {
    type: "setChartSettings";
    chartSettings: ChartSettings;
}

export function setChartSettingsMessage(chartSettings: ChartSettings): SetChartSettingsMessage {
    return { type: "setChartSettings", chartSettings };
}

export type LineId = string;
export interface LineInfo {
    points: LineData;
    color: string;
    lineWidth: number;
    yBounds: Bounds;
}

interface AddLineMessage {
    type: "addLine";
    id: LineId;
    lineInfo: LineInfo;
}

export function addLineMessage(id: LineId, lineInfo: LineInfo): AddLineMessage {
    return { type: "addLine", id, lineInfo };
}

interface ChangeLineMessage {
    type: "changeLine";
    id: LineId;
    lineInfo: Partial<LineInfo>;
}

export function changeLineMessage(id: LineId, lineInfo: Partial<LineInfo>): ChangeLineMessage {
    return { type: "changeLine", id, lineInfo };
}

interface RemoveLineMessage {
    type: "removeLine";
    id: LineId;
}

export function removeLineMessage(id: LineId): RemoveLineMessage {
    return { type: "removeLine", id };
}
