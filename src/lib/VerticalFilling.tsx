import { Bounds } from "./basic-types";
import { useChartContext } from "./Chart";
import { useId } from "./utils";
import { useEffect } from "react";
import { useFirstMountState, useShallowCompareEffect, useUpdateEffect } from "react-use";

interface VerticalFillingProps {
    intervals: Bounds[];
    color: string;
}

export function VerticalFilling(props: VerticalFillingProps) {
    const { intervals, color } = props;

    const id = useId();

    const chartContext = useChartContext();
    useEffect(() => {
        chartContext.addVerticalFilling(id, {
            intervals,
            color,
        });
        return () => chartContext.removeVerticalFilling(id);
    }, []);

    useUpdateEffect(() => {
        chartContext.changeVerticalFilling(id, { color });
    }, [color]);

    const isFirstMount = useFirstMountState();
    useShallowCompareEffect(() => {
        if (!isFirstMount) {
            chartContext.changeVerticalFilling(id, { intervals });
        }
    }, [intervals]);

    return null;
}
