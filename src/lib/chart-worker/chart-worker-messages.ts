import { Bounds } from "../basic-types";
import { ChartSettings } from "../settings-types";
import { Id, LineInfo, VerticalFilling } from "./worker-types";

export type MainToChartWorkerMessage =
    | SetCanvasMessage
    | SetCanvasSizeMessage
    | SetXBoundsAndRedrawMessage
    | SetChartSettingsMessage
    | AddLineMessage
    | ChangeLineMessage
    | RemoveLineMessage
    | AddVerticalFillingMessage
    | ChangeVerticalFillingMessage
    | RemoveVerticalFillingMessage;

interface SetCanvasMessage {
    type: "setCanvas";
    canvas?: OffscreenCanvas;
    devicePixelRatio: number;
}

export function setCanvasMessage(canvas: OffscreenCanvas | undefined, devicePixelRatio: number): SetCanvasMessage {
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

interface AddLineMessage {
    type: "addLine";
    id: Id;
    lineInfo: LineInfo;
}

export function addLineMessage(id: Id, lineInfo: LineInfo): AddLineMessage {
    return { type: "addLine", id, lineInfo };
}

interface ChangeLineMessage {
    type: "changeLine";
    id: Id;
    lineInfo: Partial<LineInfo>;
}

export function changeLineMessage(id: Id, lineInfo: Partial<LineInfo>): ChangeLineMessage {
    return { type: "changeLine", id, lineInfo };
}

interface RemoveLineMessage {
    type: "removeLine";
    id: Id;
}

export function removeLineMessage(id: Id): RemoveLineMessage {
    return { type: "removeLine", id };
}

interface AddVerticalFillingMessage {
    type: "addVerticalFilling";
    id: Id;
    verticalFilling: VerticalFilling;
}

export function addVerticalFillingMessage(id: Id, verticalFilling: VerticalFilling): AddVerticalFillingMessage {
    return { type: "addVerticalFilling", id, verticalFilling };
}

interface ChangeVerticalFillingMessage {
    type: "changeVerticalFilling";
    id: Id;
    verticalFilling: Partial<VerticalFilling>;
}

export function changeVerticalFillingMessage(
    id: Id,
    verticalFilling: Partial<VerticalFilling>,
): ChangeVerticalFillingMessage {
    return { type: "changeVerticalFilling", id, verticalFilling };
}

interface RemoveVerticalFillingMessage {
    type: "removeVerticalFilling";
    id: Id;
}

export function removeVerticalFillingMessage(id: Id): RemoveVerticalFillingMessage {
    return { type: "removeVerticalFilling", id };
}
