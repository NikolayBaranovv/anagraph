import { DrawVerticalFillingInstruction } from "../../drawing-types";
import { Bounds } from "../../../lib/basic-types";

export function doDrawVerticalFilling(
    instruction: DrawVerticalFillingInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    xBounds: Bounds,
) {
    const { intervals, color, gridRect } = instruction;

    if (intervals.length === 0) return;

    const [xMin, xMax] = xBounds;
    const { x: gridRectX, y: gridRectY, width: gridRectWidth, height: gridRectHeight } = gridRect;

    const gridWidthDivXBounds = gridRectWidth / (xMax - xMin);

    ctx.fillStyle = color;

    const clipPath = new Path2D();
    clipPath.rect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);
    ctx.clip(clipPath);

    for (const [x1, x2] of intervals) {
        const t1 = Math.round((x1 - xMin) * gridWidthDivXBounds + gridRectX);
        const t2 = Math.round((x2 - xMin) * gridWidthDivXBounds + gridRectX);

        ctx.fillRect(t1, gridRectY, t2 - t1, gridRectHeight);
    }
}
