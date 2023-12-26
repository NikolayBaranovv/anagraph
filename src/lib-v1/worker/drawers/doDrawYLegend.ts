import { DrawYLegendInstruction } from "../../drawing-types";
import { generateTicks, scale } from "../../../lib/utils";
import { yLabel } from "../../../lib/chart-worker/labels";
import { Bounds } from "../../../lib/basic-types";

export function doDrawYLegend(
    instruction: DrawYLegendInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    devicePixelRatio: number,
) {
    const { labelSettings, yBounds, gridRect } = instruction;

    ctx.fillStyle = labelSettings.textColor;
    ctx.font = `${labelSettings.fontStyle} ${labelSettings.fontSize * devicePixelRatio}px ${labelSettings.fontFamily}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (const y of generateTicks(yBounds, gridRect.height, labelSettings.yLabelsHeight)) {
        const ypx = Math.round(scale(y, yBounds, [gridRect.y + gridRect.height, gridRect.y]));
        ctx.fillRect(
            gridRect.x - labelSettings.bulletRadius,
            ypx - labelSettings.bulletRadius,
            labelSettings.bulletRadius * 2,
            labelSettings.bulletRadius * 2,
        );

        const text = yLabel(y);
        const x = gridRect.x - labelSettings.yLabelsGap;
        ctx.fillText(text, x, ypx);
    }
}
