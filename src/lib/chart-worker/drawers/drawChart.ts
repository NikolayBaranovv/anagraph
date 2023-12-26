import { ChartInfo, DrawContext } from "../worker-types";
import { Rect } from "../../basic-types";
import { calcGridAreaCpx } from "../../settings-types";
import { drawTimeXGrid } from "./drawTimeXGrid";
import { drawYGrid } from "./drawYGrid";
import { drawTimeXLegend } from "./drawTimeXLegend";
import { drawYLegend } from "./drawYLegend";
import { drawLine } from "./drawLine";

export function drawChart(drawContext: DrawContext, chartInfo: ChartInfo) {
    const { settings, lines, xBounds } = chartInfo;

    const { canvas, ctx } = drawContext;

    if (settings.background == null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const plotArea: Rect = calcGridAreaCpx(
        { width: canvas.width, height: canvas.height },
        settings,
        drawContext.devicePixelRatio,
    );

    if (settings.grid.x.draw) {
        drawTimeXGrid(drawContext, settings.grid.lines, settings.legend.labels, xBounds, plotArea);
    }
    if (settings.grid.y.draw) {
        drawYGrid(drawContext, settings.legend.y.minHeight, settings.grid.lines, settings.grid.y.bounds, plotArea);
    }

    if (settings.legend.x.draw) {
        drawTimeXLegend(drawContext, settings.legend, chartInfo.xBounds, plotArea);
    }
    if (settings.legend.y.draw) {
        drawYLegend(drawContext, settings.legend, settings.grid.y.bounds, plotArea);
    }

    ctx.save();
    const clipPath = new Path2D();
    clipPath.rect(plotArea.x, plotArea.y, plotArea.width, plotArea.height);
    ctx.clip(clipPath);
    for (const lineAttrs of lines.values()) {
        drawLine(drawContext, lineAttrs, xBounds, plotArea);
    }
    ctx.restore();
}
