import { useCallback, useContext, useEffect } from "react";
import { useGridRectCpx, useLabelSettings } from "./LayoutManager";
import { CanvasContext } from "./Canvas";
import { useBoundsContext } from "./BoundsManager";
import { generateTimeTicks, scale } from "./utils";
import { Bounds } from "./useDragAndZoom";

function label(x: number, prevX: number | null): string[] {
    const dt = new Date(x);
    const prev_dt = prevX == null ? null : new Date(prevX);
    if (
        prev_dt != null &&
        prev_dt.getFullYear() == dt.getFullYear() &&
        prev_dt.getMonth() == dt.getMonth() &&
        prev_dt.getDate() == dt.getDate()
    ) {
        return [`${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`];
    } else {
        return [
            `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`,
            `${dt.getDate().toString().padStart(2, "0")}.${(dt.getMonth() + 1)
                .toString()
                .padStart(2, "0")}.${dt.getFullYear()}`,
        ];
    }
}

export function TimeXLegend(): null {
    const { ctx } = useContext(CanvasContext);

    const gridLayout = useGridRectCpx();
    const labelSettings = useLabelSettings();

    const drawer = useCallback(
        (xBounds: Bounds) => {
            if (!ctx) return;

            ctx.save();
            ctx.fillStyle = labelSettings.textColor;
            ctx.textBaseline = "top";
            ctx.font = `${labelSettings.fontSize * window.devicePixelRatio}px ${labelSettings.fontFamily}`;

            const sampleSize = ctx.measureText("00:00");

            let prevX: number | null = null;

            for (const x of generateTimeTicks(
                xBounds,
                gridLayout.width,
                (sampleSize.width / gridLayout.width) * (xBounds[1] - xBounds[0]) * 1.3
            )) {
                const xpx = Math.round(scale(x, xBounds, [gridLayout.x, gridLayout.x + gridLayout.width]));
                ctx.fillRect(
                    xpx - labelSettings.bulletRadius,
                    gridLayout.y + gridLayout.height - labelSettings.bulletRadius,
                    labelSettings.bulletRadius * 2,
                    labelSettings.bulletRadius * 2
                );

                const text = label(x, prevX);
                prevX = x;

                let y = gridLayout.y + gridLayout.height + labelSettings.xLabelsGap;
                for (const line of text) {
                    const measure: TextMetrics = ctx.measureText(line);
                    ctx.fillText(line, xpx - measure.width / 2, y);
                    y += measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent;
                }
            }

            ctx.restore();
        },
        [ctx, gridLayout, labelSettings]
    );

    const boundsContext = useBoundsContext();
    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}
