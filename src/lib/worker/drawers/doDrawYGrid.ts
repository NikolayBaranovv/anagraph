import { Bounds, DrawYGridInstruction } from "../../drawing-types";
import { generateTicks, scale } from "../../utils";

export function doDrawYGrid(
    instruction: DrawYGridInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    xBounds: Bounds,
) {
    const { color, lineWidth, gridRect, yBounds } = instruction;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    for (const y of generateTicks(yBounds, gridRect.height, 50)) {
        const ypx = Math.round(scale(y, yBounds, [gridRect.y, gridRect.y + gridRect.height])) + 0.5;
        ctx.beginPath();
        ctx.moveTo(gridRect.x, ypx);
        ctx.lineTo(gridRect.x + gridRect.width, ypx);
        ctx.stroke();
    }
}
