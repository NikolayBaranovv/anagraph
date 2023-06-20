import { useCallback } from "react";
import { useBoundsContext } from "./BoundsManager";
import { useDrawCallback } from "./Canvas";
import { generateTicks, generateTimeTicks, scale } from "./utils";
import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";

export function Grid() {
    const { getCurrentXBounds } = useBoundsContext();
    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const drawer = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const xBounds = getCurrentXBounds();

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 1;

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
        },
        [gridRect, yBounds]
    );

    useDrawCallback(drawer);

    return null;
}
