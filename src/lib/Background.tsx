import { useMemo } from "react";
import { useCanvasContext, useDrawingInstruction } from "./Canvas";
import { clearBackgroundInstruction } from "./drawing-types";

export const Background = function Background() {
    const {
        canvasSizeCpx: { width, height },
    } = useCanvasContext();

    const instruction = useMemo(() => clearBackgroundInstruction(width, height), [width, height]);
    useDrawingInstruction(instruction);

    return null;
};
