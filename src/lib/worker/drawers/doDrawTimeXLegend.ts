import { Bounds, DrawTimeXLegendInstruction } from "../../drawing-types";
import { generateTimeTicks, scale } from "../../utils";
import { timeXLabel } from "./labels";

export function doDrawTimeXLegend(
    instruction: DrawTimeXLegendInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    xBounds: Bounds,
    devicePixelRatio: number,
) {
    const { labelSettings, gridRect } = instruction;

    ctx.fillStyle = labelSettings.textColor;
    ctx.textBaseline = "top";
    ctx.font = `${labelSettings.fontStyle} ${labelSettings.fontSize * devicePixelRatio}px ${labelSettings.fontFamily}`;

    const sampleSize = ctx.measureText("00:00");

    let prevX: number | null = null;

    for (const x of generateTimeTicks(
        xBounds,
        gridRect.width,
        (sampleSize.width / gridRect.width) * (xBounds[1] - xBounds[0]) * 1.3,
    )) {
        const xpx = Math.round(scale(x, xBounds, [gridRect.x, gridRect.x + gridRect.width]));
        ctx.fillRect(
            xpx - labelSettings.bulletRadius,
            gridRect.y + gridRect.height - labelSettings.bulletRadius,
            labelSettings.bulletRadius * 2,
            labelSettings.bulletRadius * 2,
        );

        const text = timeXLabel(x, prevX);
        prevX = x;

        let y = gridRect.y + gridRect.height + labelSettings.xLabelsGap;
        for (let i = 0, len = text.length; i < len; i++) {
            const line = text[i];
            const measure: TextMetrics = ctx.measureText(line);
            ctx.fillText(line, xpx - measure.width / 2, y);
            y += measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent;
        }
    }
}
