import { useCallback, useContext, useEffect } from "react";
import { BoundsContext } from "./bounds";
import { CanvasContext } from "./Canvas";

export function Background() {
    const boundsContext = useContext(BoundsContext);

    const { ctx, width, height } = useContext(CanvasContext);

    const drawer = useCallback(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}
