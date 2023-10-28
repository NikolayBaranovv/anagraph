import { Bounds, DrawingInstruction } from "../../drawing-types";
import { doClearBackground } from "./doClearBackground";
import { doDrawGrid } from "./doDrawGrid";
import { doDrawYLegend } from "./doDrawYLegend";
import { doDrawTimeXLegend } from "./doDrawTimeXLegend";
import { doDrawLine } from "./doDrawLine";
import { assertNever } from "../../utils";

export function drawInstruction(
    instruction: DrawingInstruction,
    ctx: OffscreenCanvasRenderingContext2D,
    xBounds: Bounds,
    devicePixelRatio: number,
): void {
    ctx.save();
    switch (instruction.type) {
        case "clearBackground": {
            doClearBackground(instruction, ctx);
            break;
        }

        case "drawGrid": {
            doDrawGrid(instruction, ctx, xBounds);
            break;
        }

        case "drawYLegend": {
            doDrawYLegend(instruction, ctx, devicePixelRatio);
            break;
        }

        case "drawTimeXLegend": {
            doDrawTimeXLegend(instruction, ctx, xBounds, devicePixelRatio);
            break;
        }

        case "drawLine": {
            doDrawLine(instruction, ctx, xBounds, devicePixelRatio);
            break;
        }

        default: {
            assertNever(instruction);
        }
    }
    ctx.restore();
}
