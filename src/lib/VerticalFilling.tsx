import { Bounds } from "./basic-types";
import { useChartContext } from "./Chart";
import { useId } from "./utils";
import { useEffect } from "react";
import { useUpdateEffect } from "react-use";

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
        chartContext.changeVerticalFilling(id, { intervals, color });
    }, [intervals, color]);

    return null;
}
