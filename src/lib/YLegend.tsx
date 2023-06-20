import { useDrawCallback } from "./Canvas";
import { useCallback } from "react";
import { useGridRectCpx, useLabelSettings } from "./LayoutManager";
import { generateTicks, scale } from "./utils";
import { useYAxisContext } from "./YAxisProvider";

function label(y: number): string {
    return y.toFixed(1);
}

export function YLegend(): null {
    const { bounds: yBounds } = useYAxisContext();
    const gridLayout = useGridRectCpx();
    const labelSettings = useLabelSettings();

    const drawer = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = labelSettings.textColor;
            ctx.font = `${labelSettings.fontSize * window.devicePixelRatio}px ${labelSettings.fontFamily}`;
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            for (const y of generateTicks(yBounds, gridLayout.height, labelSettings.yLabelsHeight)) {
                const ypx = Math.round(scale(y, yBounds, [gridLayout.y + gridLayout.height, gridLayout.y]));
                ctx.fillRect(
                    gridLayout.x - labelSettings.bulletRadius,
                    ypx - labelSettings.bulletRadius,
                    labelSettings.bulletRadius * 2,
                    labelSettings.bulletRadius * 2
                );

                const text = label(y);
                const x = gridLayout.x - labelSettings.yLabelsGap;
                ctx.fillText(text, x, ypx);
            }
        },
        [gridLayout, labelSettings]
    );

    useDrawCallback(drawer);

    return null;
}
