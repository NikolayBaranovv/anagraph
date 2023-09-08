import { useMemo } from "react";
import { useDrawingInstruction } from "./Canvas";
import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { drawGridInstruction } from "./drawing-types";

interface GridProps {
    color?: string;
}

export function Grid(props: GridProps) {
    const { color = "#ccc" } = props;

    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const instruction = useMemo(() => drawGridInstruction(color, 1, gridRect, yBounds), [color, gridRect, yBounds]);
    useDrawingInstruction(instruction);

    return null;
}
