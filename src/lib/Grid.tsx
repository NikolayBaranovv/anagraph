import { useMemo } from "react";
import { useDrawingInstruction } from "./Canvas";
import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { drawGridInstruction } from "./drawing-types";

interface GridProps {
    color?: string;
    lineWidth?: number;
}

export function Grid(props: GridProps) {
    const { color = "#ccc", lineWidth = 1 } = props;

    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawGridInstruction(color, lineWidth, gridRect, yBounds),
        [color, lineWidth, gridRect, yBounds],
    );
    useDrawingInstruction(instruction);

    return null;
}
