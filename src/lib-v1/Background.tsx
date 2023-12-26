import React, { useMemo } from "react";
import { useCanvasContext, useDrawingInstruction } from "./Canvas";
import { clearBackgroundInstruction } from "./drawing-types";

interface BackgroundProps {
    color?: string;
}

export const Background: React.FC<BackgroundProps> = (props) => {
    const {
        canvasSizeCpx: { width, height },
    } = useCanvasContext();

    const instruction = useMemo(
        () => clearBackgroundInstruction(width, height, props.color ?? null),
        [width, height, props.color],
    );
    useDrawingInstruction(instruction);

    return null;
};
