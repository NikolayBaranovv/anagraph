import { GraphData, scale } from "./utils";
import { useCallback, useMemo } from "react";
import { useBoundsContext } from "./BoundsManager";
import { visualDownsample } from "./downsample";
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

    const [yMin, yMax] = yBounds;

    const clipPath = useMemo(() => {
        const clipping = new Path2D();
        clipping.rect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);
        return clipping;
    }, [gridRect]);

    const draw = useCallback(
        function drawLine(ctx: CanvasRenderingContext2D) {
            if (props.data.length === 0) return;

            const effectiveXBounds = getCurrentXBounds();

            const downsampled = visualDownsample(props.data, effectiveXBounds, gridRect.width);

            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";
            ctx.strokeStyle = props.color;

            ctx.clip(clipPath);

            const scaled = new Array(downsampled.length);
            for (let i = 0, len = downsampled.length; i < len; i++) {
                const [x, y] = downsampled[i];
                scaled[i] = [
                    scale(x, effectiveXBounds, [gridRect.x, gridRect.x + gridRect.width]),
                    y == null ? null : scale(y, [yMin, yMax], [gridRect.y + gridRect.height, gridRect.y]),
                ];
            }

            for (let i = 0; i < scaled.length - 1; i++) {
                const scaled_i = scaled[i];
                const scaled_ip1 = scaled[i + 1];
                const x1 = scaled_i[0],
                    y1 = scaled_i[1];
                const x2 = scaled_ip1[0],
                    y2 = scaled_ip1[1];
                if (y1 == null || y2 == null) continue;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        },
        [gridRect, props.color, props.data, yMin, yMax],
    );

    useDrawCallback(draw);

    return null;
};
