import { useCallback } from "react";
import { useCanvasContext, useDrawCallback } from "./Canvas";

export const Background = function Background() {
    const {
        canvasSizeCpx: { width, height },
    } = useCanvasContext();

    const drawer = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            console.log("clearRect");
            ctx.clearRect(0, 0, width, height);
        },
        [width, height],
    );

    useDrawCallback(drawer);

    return null;
};
