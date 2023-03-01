import { useCallback, useContext, useEffect } from "react";
import { LayoutContext, useGridRect } from "./LayoutManager";
import { CanvasContext } from "./Canvas";
import { BoundsContext } from "./BoundsManager";

export function Legends(): null {
    const { ctx, size: canvasSize } = useContext(CanvasContext);

    const layout = useContext(LayoutContext);

    const drawer = useCallback(() => {
        if (!ctx) return;

        ctx.strokeStyle = "#22f";
        ctx.moveTo(0, 0);
        ctx.lineTo(layout.leftLabelsWidth, canvasSize.height);
        ctx.moveTo(layout.leftLabelsWidth, 0);
        ctx.lineTo(0, canvasSize.height);
        ctx.moveTo(0, canvasSize.height - layout.bottomLabelsHeight);
        ctx.lineTo(canvasSize.width, canvasSize.height);
        ctx.moveTo(0, canvasSize.height);
        ctx.lineTo(canvasSize.width, canvasSize.height - layout.bottomLabelsHeight);
        ctx.stroke();
    }, [ctx, layout, canvasSize]);

    const boundsContext = useContext(BoundsContext);
    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}
