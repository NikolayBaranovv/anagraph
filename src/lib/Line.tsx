import { GraphData } from "./utils";
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

            const { 0: xMin, 1: xMax } = effectiveXBounds;
            const { x: gridRectX, y: gridRectY, width: gridRectWidth, height: gridRectHeight } = gridRect;
            const gridBottom = gridRectY + gridRectHeight;
            const gridWidthDivXBounds = gridRectWidth / (xMax - xMin);
            const gridHeightDivYBounds = gridRectHeight / (yMax - yMin);
            // Math.round() is here because canvas is faster with integer coordinates
            for (let i = 0, len = downX.length; i < len; i++) {
                downX[i] = Math.round((downX[i] - xMin) * gridWidthDivXBounds + gridRectX);
            }
            for (let i = 0, len = downY.length; i < len; i++) {
                const y = downY[i];
                downY[i] = y == null ? null : Math.round(gridBottom - (y - yMin) * gridHeightDivYBounds);
            }

            ctx.beginPath();
            let penDown = false;
            for (let i = 0; i < downX.length; i++) {
                const x = downX[i],
                    y = downY[i];
                if (y == null) {
                    penDown = false;
                    continue;
                }
                if (!penDown) {
                    ctx.moveTo(x, y);
                    penDown = true;
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
