import { useCallback, useContext, useEffect } from "react";
import { BoundsContext } from "./BoundsManager";
import { CanvasContext } from "./Canvas";
import { Bounds } from "./useDragAndZoom";
import { generateTicks, generateTimeTicks, scale } from "./utils";
import { useGridRectCpx } from "./LayoutManager";

export function Grid() {
    const boundsContext = useContext(BoundsContext);
    const { ctx } = useContext(CanvasContext);

    const gridRect = useGridRectCpx();

    const drawer = useCallback(
        (xBounds: Bounds) => {
            if (!ctx) return;

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 1;

            for (const y of generateTicks(boundsContext.yBounds, gridRect.height, 50)) {
                const ypx =
                    Math.round(scale(y, boundsContext.yBounds, [gridRect.y, gridRect.y + gridRect.height])) + 0.5;
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
        [ctx, gridRect, boundsContext.yBounds]
    );

    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}
