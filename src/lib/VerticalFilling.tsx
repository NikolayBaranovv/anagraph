import { Bounds, drawVerticalFillingInstruction } from "./drawing-types";
import { useGridRectCpx } from "./LayoutManager";
import { useMemo } from "react";
import { useDrawingInstruction } from "./Canvas";

interface VerticalFillingProps {
    intervals: Bounds[];
    color: string;
}

export function VerticalFilling(props: VerticalFillingProps) {
    const { intervals, color } = props;
    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawVerticalFillingInstruction(intervals, color, gridRect),
        [intervals, color, gridRect],
    );
    useDrawingInstruction(instruction);

    return null;
}
