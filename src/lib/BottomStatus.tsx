import { Bounds } from "./basic-types";
import { useId } from "./utils";
import { useChartContext } from "./Chart";
import { useEffect } from "react";
import { useFirstMountState, useShallowCompareEffect, useUpdateEffect } from "react-use";

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
    }, []);

    useUpdateEffect(() => {
        chartContext.changeBottomStatus(id, { color });
    }, [color]);

    const isFirstMount = useFirstMountState();
    useShallowCompareEffect(() => {
        if (!isFirstMount) {
            chartContext.changeBottomStatus(id, { intervals });
        }
    }, [intervals]);

    return null;
}
