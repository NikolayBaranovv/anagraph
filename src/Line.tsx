import { GraphData, scale } from "./utils";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { BoundsContext } from "./bounds";
import { FPSContext } from "./fps";
import { CanvasContext } from "./Canvas";
import { Bounds } from "./useDragAndZoom";
import { visualDownsample } from "./downsample";

interface LineProps {
    data: GraphData;
}

export function Line(props: LineProps) {
    const boundsContext = useContext(BoundsContext);

    const incFrameCounter = useContext(FPSContext).incCounter;

    const { ctx, width, height } = useContext(CanvasContext);

    const grad = useMemo(() => {
        if (ctx == null) {
            return null;
        }

        const grd = ctx.createLinearGradient(0, height, 0, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "blue");
        return grd;
    }, [ctx, height]);

    const [ymin, ymax] = boundsContext.yBounds;

    const draw = useCallback(
        (effectiveXBounds: Bounds) => {
            if (props.data.length === 0 || !ctx || !grad) return;

            const downsampled = visualDownsample(
                props.data,
                effectiveXBounds,
                width
            );

            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";
            ctx.strokeStyle = grad;

            const scaled = downsampled.map(
                ([x, y]): [number, number | null] => [
                    scale(x, effectiveXBounds, [0, width]),
                    y == null ? null : scale(y, [ymin, ymax], [0, height]),
                ]
            );

            for (let i = 0; i < scaled.length - 1; i++) {
                const [x1, y1] = scaled[i];
                const [x2, y2] = scaled[i + 1];
                if (y1 == null || y2 == null) continue;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            incFrameCounter();
        },
        [ctx, width, height, grad, props.data, ymin, ymax, incFrameCounter]
    );

    useEffect(() => {
        boundsContext.addXBoundsCallback(draw);
        return () => boundsContext.removeXBoundsCallback(draw);
    }, [boundsContext, draw]);

    return null;
}
