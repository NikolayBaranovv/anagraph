import { MainToChartWorkerMessage } from "./chart-worker-messages";
import { assertNever } from "../utils";
import { defaultChartSettings } from "../settings-types";
import { ChartInfo, DrawContext, Id, LineInfo, VerticalFilling } from "./worker-types";
import { drawChart } from "./drawers/drawChart";

export function startChartWorker() {
    let drawContext: DrawContext | null = null;

    const chartInfo: ChartInfo = {
        settings: defaultChartSettings,
        xBounds: [0, 1],
        lines: new Map<Id, LineInfo>(),
        verticalFillings: new Map<Id, VerticalFilling>(),
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
                break;
            }

            case "setCanvasSize": {
                if (drawContext) {
                    drawContext.canvas.width = msg.data.width;
                    drawContext.canvas.height = msg.data.height;
                    planRedraw();
                }
                break;
            }

            case "setXBoundsAndRedraw": {
                chartInfo.xBounds = msg.data.xBounds;
                planRedraw();
                break;
            }

            case "setChartSettings": {
                chartInfo.settings = msg.data.chartSettings;
                break;
            }

            case "addLine": {
                chartInfo.lines.set(msg.data.id, msg.data.lineInfo);
                planRedraw();
                break;
            }

            case "changeLine": {
                const line = chartInfo.lines.get(msg.data.id);
                if (line) {
                    chartInfo.lines.set(msg.data.id, { ...line, ...msg.data.lineInfo });
                    planRedraw();
                }
                break;
            }

            case "removeLine": {
                chartInfo.lines.delete(msg.data.id);
                planRedraw();
                break;
            }

            case "addVerticalFilling": {
                chartInfo.verticalFillings.set(msg.data.id, msg.data.verticalFilling);
                planRedraw();
                break;
            }

            case "changeVerticalFilling": {
                const filling = chartInfo.verticalFillings.get(msg.data.id);
                if (filling) {
                    chartInfo.verticalFillings.set(msg.data.id, { ...filling, ...msg.data.verticalFilling });
                    planRedraw();
                }
                break;
            }

            case "removeVerticalFilling": {
                chartInfo.verticalFillings.delete(msg.data.id);
                planRedraw();
                break;
            }

            default: {
                assertNever(msg.data);
            }
        }
    });
}
