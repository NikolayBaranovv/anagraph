import { GraphData, scale } from "./utils";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { BoundsContext } from "./BoundsManager";
import { FPSContext } from "./fps";
import { CanvasContext } from "./Canvas";
import { Bounds } from "./useDragAndZoom";
import { visualDownsample } from "./downsample";
import { useGridRect } from "./LayoutManager";

interface LineProps {
    data: GraphData;
}

export function Line(props: LineProps) {
    const boundsContext = useContext(BoundsContext);

    const incFrameCounter = useContext(FPSContext).incCounter;

    const { ctx } = useContext(CanvasContext);

    const gridRect = useGridRect();

    const grad = useMemo(() => {
        if (ctx == null) {
            return null;
        }

        const grd = ctx.createLinearGradient(gridRect.x, gridRect.y + gridRect.height, gridRect.x, gridRect.y);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "blue");
        return grd;
    }, [ctx, gridRect]);

    const [ymin, ymax] = boundsContext.yBounds;

    const clipPath = useMemo(() => {
        const clipping = new Path2D();
        clipping.rect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);
        return clipping;
    }, [gridRect]);

    const draw = useCallback(
        (effectiveXBounds: Bounds) => {
            if (props.data.length === 0 || !ctx || !grad) return;

            const downsampled = visualDownsample(props.data, effectiveXBounds, gridRect.width);

            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";
            ctx.strokeStyle = grad;

            ctx.save();
            try {
                ctx.clip(clipPath);

                const scaled = downsampled.map(([x, y]): [number, number | null] => [
                    scale(x, effectiveXBounds, [gridRect.x, gridRect.x + gridRect.width]),
                    y == null ? null : scale(y, [ymin, ymax], [gridRect.y, gridRect.y + gridRect.height]),
                ]);

                for (let i = 0; i < scaled.length - 1; i++) {
                    const [x1, y1] = scaled[i];
                    const [x2, y2] = scaled[i + 1];
                    if (y1 == null || y2 == null) continue;

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            } finally {
                ctx.restore();
            }

            incFrameCounter();
        },
        [ctx, gridRect, grad, props.data, ymin, ymax, incFrameCounter]
    );

    useEffect(() => {
        boundsContext.addXBoundsCallback(draw);
        return () => boundsContext.removeXBoundsCallback(draw);
    }, [boundsContext, draw]);

    return null;
}
