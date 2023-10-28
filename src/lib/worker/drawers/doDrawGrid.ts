import { Bounds, DrawGridInstruction } from "../../drawing-types";
import { generateTicks, generateTimeTicks, scale } from "../../utils";

export function doDrawGrid(instruction: DrawGridInstruction, ctx: OffscreenCanvasRenderingContext2D, xBounds: Bounds) {
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

    for (const x of generateTimeTicks(xBounds, gridRect.width, 60e3 / 10)) {
        const xpx = Math.round(scale(x, xBounds, [gridRect.x, gridRect.x + gridRect.width])) + 0.5;
        ctx.beginPath();
        ctx.moveTo(xpx, gridRect.y);
        ctx.lineTo(xpx, gridRect.y + gridRect.height);
        ctx.stroke();
    }
}
