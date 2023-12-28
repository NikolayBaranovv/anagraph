import { Bounds } from "./basic-types";
import { useId } from "./utils";
import { useChartContext } from "./Chart";
import { useEffect } from "react";
import { useUpdateEffect } from "react-use";

interface BottomStatusProps {
    intervals: Bounds[];
    color: string;
}

export function BottomStatus(props: BottomStatusProps) {
    const { intervals, color } = props;

    const id = useId();

    const chartContext = useChartContext();
    useEffect(() => {
        chartContext.addBottomStatus(id, {
            intervals,
            color,
        });
        return () => chartContext.removeBottomStatus(id);
    });

    useUpdateEffect(() => {
        chartContext.changeBottomStatus(id, { intervals, color });
    }, [intervals, color]);

    return null;
}
