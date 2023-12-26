import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { useDrawingInstruction } from "./Canvas";
import { drawLineInstruction } from "./drawing-types";
import { useMemo } from "react";
import { LineData } from "../lib/basic-types";

interface LineProps {
    data: LineData;
    color: string;
    lineWidth?: number;
}

export function Line(props: LineProps) {
    const { data, color, lineWidth = 2 } = props;
    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawLineInstruction(data, color, gridRect, yBounds, lineWidth),
        [data, color, gridRect, yBounds, lineWidth],
    );
    useDrawingInstruction(instruction);

    return null;
}
