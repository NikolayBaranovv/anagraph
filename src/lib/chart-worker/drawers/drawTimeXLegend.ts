import { DrawContext } from "../worker-types";
import { LegendSettings } from "../../settings-types";
import { Bounds, Rect } from "../../basic-types";
import { generateTimeTicks, scale } from "../../utils";
import { timeXLabel } from "../labels";

export function drawTimeXLegend(
    drawContext: DrawContext,
    legendSettings: LegendSettings,
    xBounds: Bounds,
    drawArea: Rect,
) {
    const { ctx, devicePixelRatio } = drawContext;

    ctx.save();
    ctx.fillStyle = legendSettings.labels.color;
    ctx.textBaseline = "top";
    ctx.font = `${legendSettings.labels.fontStyle} ${legendSettings.labels.fontSize * devicePixelRatio}px ${
        legendSettings.labels.fontFamily
    }`;

    const sampleSize = ctx.measureText("00.00.0000");

    let prevX: number | null = null;

    for (const x of generateTimeTicks(
        xBounds,
        drawArea.width,
        (sampleSize.width / drawArea.width) * (xBounds[1] - xBounds[0]) * 1.1,
    )) {
        const xpx = Math.round(scale(x, xBounds, [drawArea.x, drawArea.x + drawArea.width]));
        ctx.fillRect(
            xpx - legendSettings.bulletRadius,
            drawArea.y + drawArea.height - legendSettings.bulletRadius,
            legendSettings.bulletRadius * 2,
            legendSettings.bulletRadius * 2,
        );

        const text = timeXLabel(x, prevX);
        prevX = x;

        let y = drawArea.y + drawArea.height + legendSettings.x.gap;
        for (let i = 0, len = text.length; i < len; i++) {
            const line = text[i];
            const measure: TextMetrics = ctx.measureText(line);
            ctx.fillText(line, xpx - measure.width / 2, y);
            y += measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent;
        }
    }
    ctx.restore();
}
