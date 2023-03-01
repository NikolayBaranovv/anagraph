import { useCallback, useContext, useEffect } from "react";
import { BoundsContext } from "./BoundsManager";
import { CanvasContext } from "./Canvas";
import { Bounds } from "./useDragAndZoom";
import { scale } from "./utils";
import { useGridRect } from "./LayoutManager";

const log10_5 = Math.log10(5);
const log10_4 = Math.log10(4);
const log10_2 = Math.log10(2);

function* generateTicks(range: Bounds, pixels: number, minPixels: number): Generator<number> {
    const xRange = range[1] - range[0];

    const targetXStepLog = Math.log10((xRange / pixels) * minPixels);
    let xStepLog = Math.ceil(targetXStepLog);
    if (xStepLog - targetXStepLog > log10_5) xStepLog -= log10_5;
    else if (xStepLog - targetXStepLog > log10_4) xStepLog -= log10_4;
    else if (xStepLog - targetXStepLog > log10_2) xStepLog -= log10_2;
    const xStep = Math.pow(10, xStepLog);

    const xMin = Math.ceil(range[0] / xStep) * xStep;
    const xMax = Math.floor(range[1] / xStep) * xStep;

    for (let x = xMin; x <= xMax; x += xStep) {
        yield x;
    }
}

export function Grid() {
    const boundsContext = useContext(BoundsContext);
    const { ctx } = useContext(CanvasContext);

    const gridRect = useGridRect();

    const drawer = useCallback(
        (xBounds: Bounds) => {
            if (!ctx) return;

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 1;

            for (const y of generateTicks(boundsContext.yBounds, gridRect.height, 50)) {
                const ypx = Math.round(scale(y, boundsContext.yBounds, [gridRect.y, gridRect.height])) + 0.5;
                ctx.beginPath();
                ctx.moveTo(gridRect.x, ypx);
                ctx.lineTo(gridRect.x + gridRect.width, ypx);
                ctx.stroke();
            }

            for (const x of generateTicks(xBounds, gridRect.width, 50)) {
                const xpx = Math.round(scale(x, xBounds, [gridRect.x, gridRect.width])) + 0.5;
                ctx.beginPath();
                ctx.moveTo(xpx, gridRect.y);
                ctx.lineTo(xpx, gridRect.y + gridRect.height);
                ctx.stroke();
            }
        },
        [ctx, gridRect, boundsContext.yBounds]
    );

    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}
