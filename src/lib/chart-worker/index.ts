import {
    EditObjectMessages,
    isAddObjectMessage,
    isChangeObjectMessage,
    isEditObjectMessage,
    isRemoveObjectMessage,
    MainToChartWorkerMessage,
} from "./messages";
import { assertNever } from "../utils";
import { defaultChartSettings } from "../settings-types";
import { BottomStatus, ChartInfo, DrawContext, Id, LineInfo, VerticalFilling } from "./worker-types";
import { drawChart } from "./drawers/drawChart";

export function startChartWorker() {
    let drawContext: DrawContext | null = null;

    const chartInfo: ChartInfo = {
        settings: defaultChartSettings,
        xBounds: [0, 1],
        lines: new Map<Id, LineInfo>(),
        verticalFillings: new Map<Id, VerticalFilling>(),
        bottomStatuses: new Map<Id, BottomStatus>(),
    };

    let drawPlanned = false;
    function planRedraw() {
        if (drawPlanned) return;

        drawPlanned = true;
        requestAnimationFrame(() => {
            if (drawContext) {
                drawChart(drawContext, chartInfo);
            }
            // framesDrawn++;
            drawPlanned = false;
        });
    }

    function handleObjectMessages<K extends string, O extends object>(
        baseType: K,
        msg: EditObjectMessages<K, O>,
        map: Map<Id, O>,
    ): boolean {
        if (isAddObjectMessage(baseType, msg)) {
            map.set(msg.id, msg.attrs);
            planRedraw();
        } else if (isChangeObjectMessage(baseType, msg)) {
            const obj = map.get(msg.id);
            if (obj) {
                map.set(msg.id, { ...obj, ...msg.attrs });
                planRedraw();
            }
        } else if (isRemoveObjectMessage(baseType, msg)) {
            map.delete(msg.id);
            planRedraw();
        } else {
            return false;
        }
        return true;
    }

    addEventListener("message", (msg: MessageEvent<MainToChartWorkerMessage>) => {
        switch (msg.data.type) {
            case "setCanvas": {
                const { canvas, devicePixelRatio } = msg.data;
                if (canvas) {
                    const ctx = canvas.getContext("2d", { desynchronized: true });
                    if (ctx) {
                        drawContext = {
                            canvas,
                            ctx,
                            devicePixelRatio,
                        };
                    } else {
                        drawContext = null;
                    }
                }
                if (drawContext) {
                    drawContext.devicePixelRatio = msg.data.devicePixelRatio;
                }
                planRedraw();
                return;
            }

            case "setCanvasSize": {
                if (drawContext) {
                    drawContext.canvas.width = msg.data.width;
                    drawContext.canvas.height = msg.data.height;
                    planRedraw();
                }
                return;
            }

            case "setXBoundsAndRedraw": {
                chartInfo.xBounds = msg.data.xBounds;
                planRedraw();
                return;
            }

            case "setChartSettings": {
                chartInfo.settings = msg.data.chartSettings;
                return;
            }
        }

        if (isEditObjectMessage("Line", msg.data)) {
            handleObjectMessages("Line", msg.data, chartInfo.lines);
            return;
        }
        if (isEditObjectMessage("VerticalFilling", msg.data)) {
            handleObjectMessages("VerticalFilling", msg.data, chartInfo.verticalFillings);
            return;
        }
        if (isEditObjectMessage("BottomStatus", msg.data)) {
            handleObjectMessages("BottomStatus", msg.data, chartInfo.bottomStatuses);
            return;
        }

        assertNever(msg.data);
    });
}
