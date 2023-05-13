import { useCallback, useContext, useEffect } from "react";
import { BoundsContext } from "./BoundsManager";
import { CanvasContext } from "./Canvas";

export function Background() {
    const boundsContext = useContext(BoundsContext);

    const {
        ctx,
        canvasSizeCpx: { width, height },
    } = useContext(CanvasContext);

    const drawer = useCallback(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        // FIXME: why bounds!? These drawers should probably register themselves in
        //        Canvas context, not bounds context...
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}
