import { useMemo } from "react";
import { useDrawingInstruction } from "./Canvas";
import { useGridRectCpx, useLabelSettings } from "./LayoutManager";
import { drawTimeXGridInstruction } from "./drawing-types";

interface TimeXGridProps {
    color?: string;
    lineWidth?: number;
}

export function TimeXGrid(props: TimeXGridProps) {
    const labelSettings = useLabelSettings();
    const { color = "#ccc", lineWidth = 1 } = props;

    const gridRect = useGridRectCpx();

    const instruction = useMemo(
        () => drawTimeXGridInstruction(color, lineWidth, gridRect, labelSettings),
        [color, lineWidth, gridRect, labelSettings],
    );
    useDrawingInstruction(instruction);

    return null;
}
