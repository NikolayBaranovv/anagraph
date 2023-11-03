import { useMemo } from "react";
import { useDrawingInstruction } from "./Canvas";
import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { drawYGridInstruction } from "./drawing-types";

interface YGridProps {
    color?: string;
    lineWidth?: number;
}

export function YGrid(props: YGridProps) {
    const { color = "#ccc", lineWidth = 1 } = props;

    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawYGridInstruction(color, lineWidth, gridRect, yBounds),
        [color, lineWidth, gridRect, yBounds],
    );
    useDrawingInstruction(instruction);

    return null;
}
