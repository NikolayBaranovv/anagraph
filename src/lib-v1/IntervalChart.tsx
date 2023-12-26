import { useEffect, useMemo } from "react";
import { drawIntervalChartInstruction } from "./drawing-types";
import { useDrawingInstruction } from "./Canvas";
import { useIntervalChartsCounter } from "./LayoutManager";
import { Bounds } from "../lib";

interface IntervalChartProps {
    intervals: Bounds[];
    color: string;
    barHeight?: number;
}

export function IntervalChart(props: IntervalChartProps) {
    const { intervals, color, barHeight = 5 } = props;

    const [addChart, removeChart] = useIntervalChartsCounter();
    useEffect(() => {
        console.log("inc!");
        addChart();
        return removeChart;
    }, []);

    const instruction = useMemo(() => drawIntervalChartInstruction(intervals, color), [intervals, color]);
    useDrawingInstruction(instruction);

    return null;
}
