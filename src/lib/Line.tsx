import { useEffect, useRef, useState } from "react";
import { useChartContext } from "./Chart";
import { LineId } from "./chart-worker/chart-worker-messages";
import { useUpdateEffect } from "react-use";
import { Bounds, LineData } from "./basic-types";

interface LineProps {
    points: LineData;
    color: string;
    lineWidth?: number;
    yBounds: Bounds;
}

export function Line(props: LineProps) {
    const { points, color, lineWidth = 2, yBounds } = props;

    const [id] = useState<LineId>(Math.random().toString(36).slice(2));

    const chartContext = useChartContext();

    useEffect(() => {
        chartContext.addLine(id, {
            points,
            color,
            lineWidth,
            yBounds,
        });
        return () => chartContext.removeLine(id);
    }, []);

    useUpdateEffect(() => {
        chartContext.changeLine(id, { points, color, lineWidth, yBounds });
    }, [points, color, lineWidth, yBounds]);

    return null;
}
