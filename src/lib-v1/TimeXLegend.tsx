import { useMemo } from "react";
import { useGridRectCpx, useLabelSettings } from "./LayoutManager";
import { drawTimeXLegendInstruction } from "./drawing-types";
import { useDrawingInstruction } from "./Canvas";

export function TimeXLegend(): null {
    const gridLayout = useGridRectCpx();
    const labelSettings = useLabelSettings();

    const instruction = useMemo(
        () => drawTimeXLegendInstruction(labelSettings, gridLayout),
        [labelSettings, gridLayout],
    );
    useDrawingInstruction(instruction);

    return null;
}
