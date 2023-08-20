import { GraphData, scale } from "./utils";
import { useCallback, useMemo } from "react";
import { useBoundsContext } from "./BoundsManager";
import { visualDownsample_B } from "./downsample";
import { useGridRectCpx } from "./LayoutManager";
import { useYAxisContext } from "./YAxisProvider";
import { useDrawCallback } from "./Canvas";

interface LineProps {
    data: GraphData;
    color: string;
}

export const Line = function Line(props: LineProps) {
    const { getCurrentXBounds } = useBoundsContext();
    const { bounds: yBounds } = useYAxisContext();

    const gridRect = useGridRectCpx();

    const yMin = yBounds[0];
    const yMax = yBounds[1];

    const clipPath = useMemo(() => {
        const clipping = new Path2D();
        clipping.rect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);
        return clipping;
    }, [gridRect]);

    const draw = useCallback(
        function drawLine(ctx: CanvasRenderingContext2D) {
            if (props.data.length === 0) return;

            const effectiveXBounds = getCurrentXBounds();

            const downsampled_B = visualDownsample_B(props.data, effectiveXBounds, gridRect.width);
            const downX = downsampled_B[0],
                downY = downsampled_B[1];

            if (downX.length === 0) return;

            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";
            ctx.strokeStyle = props.color;

            ctx.clip(clipPath);

            for (let i = 0, len = downX.length; i < len; i++) {
                downX[i] = scale(downX[i], effectiveXBounds, [gridRect.x, gridRect.x + gridRect.width]);
            }
            for (let i = 0, len = downY.length; i < len; i++) {
                const y = downY[i];
                downY[i] = y == null ? null : scale(y, [yMin, yMax], [gridRect.y + gridRect.height, gridRect.y]);
            }

            // for (let i = 0; i < downX.length - 1; i++) {
            //     const x1 = downX[i],
            //         y1 = downY[i];
            //     const x2 = downX[i + 1],
            //         y2 = downY[i + 1];
            //     if (y1 == null || y2 == null) continue;
            //
            //     ctx.beginPath();
            //     ctx.moveTo(x1, y1);
            //     ctx.lineTo(x2, y2);
            //     ctx.stroke();
            // }

            ctx.beginPath();
            let moved = false;
            for (let i = 0; i < downX.length; i++) {
                const x = downX[i],
                    y = downY[i];
                if (y == null) {
                    moved = false;
                    continue;
                }
                if (!moved) {
                    ctx.moveTo(x, y);
                    moved = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        },
        [gridRect, props.color, props.data, yMin, yMax],
    );

    useDrawCallback(draw);

    return null;
};
