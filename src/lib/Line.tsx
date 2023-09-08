import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { useDrawingInstruction } from "./Canvas";
import { drawLineInstruction, GraphData } from "./drawing-types";
import { useMemo } from "react";

interface LineProps {
    data: GraphData;
    color: string;
}

export const Line = function Line(props: LineProps) {
    const { data, color } = props;
    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawLineInstruction(data, color, gridRect, yBounds),
        [data, color, gridRect, yBounds],
    );
    useDrawingInstruction(instruction);

    return null;
};
