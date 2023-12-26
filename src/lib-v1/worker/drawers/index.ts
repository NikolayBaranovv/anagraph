import { DrawingInstruction } from "../../drawing-types";
import { doClearBackground } from "./doClearBackground";
import { doDrawYGrid } from "./doDrawYGrid";
import { doDrawYLegend } from "./doDrawYLegend";
import { doDrawTimeXLegend } from "./doDrawTimeXLegend";
import { doDrawLine } from "./doDrawLine";
import { assertNever } from "../../../lib/utils";
import { doDrawVerticalFilling } from "./doDrawVerticalFilling";
import { doDrawTimeXGrid } from "./doDrawTimeXGrid";
import { Bounds } from "../../../lib/basic-types";

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

        case "drawTimeXGrid": {
            doDrawTimeXGrid(instruction, ctx, xBounds, devicePixelRatio);
            break;
        }

        case "drawYGrid": {
            doDrawYGrid(instruction, ctx, xBounds);
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

        case "drawVerticalFilling": {
            doDrawVerticalFilling(instruction, ctx, xBounds);
            break;
        }

        case "drawIntervalChart": {
            // FIXME
            break;
        }

        default: {
            assertNever(instruction);
        }
    }
    ctx.restore();
}
