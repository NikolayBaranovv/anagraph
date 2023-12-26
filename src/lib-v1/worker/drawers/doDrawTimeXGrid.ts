import { DrawXGridInstruction } from "../../drawing-types";
import { generateTimeTicks, scale } from "../../../lib/utils";
import { Bounds } from "../../../lib/basic-types";

export function doDrawTimeXGrid(
    instruction: DrawXGridInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    xBounds: Bounds,
    devicePixelRatio: number,
) {
    const { color, lineWidth, gridRect, labelSettings } = instruction;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.font = `${labelSettings.fontStyle} ${labelSettings.fontSize * devicePixelRatio}px ${labelSettings.fontFamily}`;

    const sampleSize = ctx.measureText("00.00.0000");

    for (const x of generateTimeTicks(
        xBounds,
        gridRect.width,
        (sampleSize.width / gridRect.width) * (xBounds[1] - xBounds[0]) * 1.1,
    )) {
        const xpx = Math.round(scale(x, xBounds, [gridRect.x, gridRect.x + gridRect.width])) + 0.5;
        ctx.beginPath();
        ctx.moveTo(xpx, gridRect.y);
        ctx.lineTo(xpx, gridRect.y + gridRect.height);
        ctx.stroke();
    }
}
