import { DrawContext } from "../worker-types";
import { GridLineSettings, LabelSettings } from "../../settings-types";
import { Bounds, Rect } from "../../basic-types";
import { generateTimeTicks, scale } from "../../utils";

export function drawTimeXGrid(
    drawContext: DrawContext,
    lineSettings: GridLineSettings,
    labelSettings: LabelSettings,
    xBounds: Bounds,
    drawArea: Rect,
) {
    const { color, lineWidth } = lineSettings;

    const { ctx, devicePixelRatio } = drawContext;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.font = `${labelSettings.fontStyle} ${labelSettings.fontSize * devicePixelRatio}px ${labelSettings.fontFamily}`;

    const sampleSize = ctx.measureText("00.00.0000");

    for (const x of generateTimeTicks(
        xBounds,
        drawArea.width,
        (sampleSize.width / drawArea.width) * (xBounds[1] - xBounds[0]) * 1.1,
    )) {
        const xpx = Math.round(scale(x, xBounds, [drawArea.x, drawArea.x + drawArea.width])) + 0.5;
        ctx.beginPath();
        ctx.moveTo(xpx, drawArea.y);
        ctx.lineTo(xpx, drawArea.y + drawArea.height);
        ctx.stroke();
    }
    ctx.restore();
}
