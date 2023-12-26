import { useMemo } from "react";
import { useGridRectCpx, useLabelSettings } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { drawYLegendInstruction } from "./drawing-types";
import { useDrawingInstruction } from "./Canvas";

export function YLegend(): null {
    const { bounds: yBounds } = useYAxisContext();
    const gridLayout = useGridRectCpx();
    const labelSettings = useLabelSettings();

    const instruction = useMemo(
        () => drawYLegendInstruction(labelSettings, gridLayout, yBounds),
        [yBounds, gridLayout, labelSettings],
    );
    useDrawingInstruction(instruction);

    return null;
}
