import { DrawContext, VerticalFilling } from "../worker-types";
import { Bounds, Rect } from "../../basic-types";

export function drawVerticalFilling(
    drawContext: DrawContext,
    fillingAttrs: VerticalFilling,
    xBounds: Bounds,
    plotArea: Rect,
) {
    const { ctx } = drawContext;
    const { color, intervals } = fillingAttrs;

    if (intervals.length === 0) return;

    const [xMin, xMax] = xBounds;
    const { x: plotAreaX, y: plotAreaY, width: plotAreaW, height: plotAreaH } = plotArea;

    const gridWidthDivXBounds = plotAreaW / (xMax - xMin);

    ctx.fillStyle = color;

    const clipPath = new Path2D();
    clipPath.rect(plotAreaX, plotAreaY, plotAreaW, plotAreaH);
    ctx.clip(clipPath);

    for (const [x1, x2] of intervals) {
        const t1 = Math.round((x1 - xMin) * gridWidthDivXBounds + plotAreaX);
        const t2 = Math.round((x2 - xMin) * gridWidthDivXBounds + plotAreaX);

        ctx.fillRect(t1, plotAreaY, t2 - t1, plotAreaH);
    }
}
