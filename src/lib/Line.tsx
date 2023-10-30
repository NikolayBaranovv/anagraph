import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { useDrawingInstruction } from "./Canvas";
import { drawLineInstruction, GraphData } from "./drawing-types";
import { useMemo } from "react";

interface LineProps {
    data: GraphData;
    color: string;
    lineWidth: number;
}

export function Line(props: LineProps) {
    const { data, color, lineWidth } = props;
    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawLineInstruction(data, color, gridRect, yBounds, lineWidth),
        [data, color, gridRect, yBounds, lineWidth],
    );
    useDrawingInstruction(instruction);

    return null;
}
