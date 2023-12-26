import { Bounds, divSize, mulRect, Rect, Size } from "./basic-types";

export interface LabelSettings {
    color: string;

    fontFamily: string;
    fontStyle: string;
    fontSize: number;
}

export interface GridLineSettings {
    lineWidth: number;
    color: string;
}

export interface LegendSettings {
    labels: LabelSettings;
    bulletRadius: number;
    x: {
        draw: boolean;
        height: number;
        gap: number;
    };
    y: {
        draw: boolean;
        width: number;
        gap: number;
        minHeight: 48;
    };
}

export interface ChartSettings {
    background: string | null;
    legend: LegendSettings;
    grid: {
        x: { draw: boolean };
        y: { draw: boolean; bounds: Bounds };
        lines: GridLineSettings;
    };
    topGap: number;
}

export const defaultChartSettings: ChartSettings = {
    background: null,
    legend: {
        x: {
            draw: true,
            height: 40,
            gap: 3,
        },
        y: {
            draw: true,
            width: 60,
            gap: 8,
            minHeight: 48,
        },

        bulletRadius: 3,
        labels: {
            color: "#666699",

            fontFamily: "sans-serif",
            fontStyle: "normal",
            fontSize: 16,
        },
    },
    grid: {
        x: { draw: true },
        y: { draw: true, bounds: [0, 1] },
        lines: {
            color: "#cccccc",
            lineWidth: 1,
        },
    },
    topGap: 10,
};

export function calcGridAreaLpx(canvasSizeLpx: Size, chartSettings: ChartSettings): Rect {
    return {
        x: chartSettings.legend.y.width,
        y: chartSettings.topGap,
        width: canvasSizeLpx.width - chartSettings.legend.y.width,
        height: canvasSizeLpx.height - chartSettings.topGap - chartSettings.legend.x.height,
    };
}

export function calcGridAreaCpx(canvasSizeCpx: Size, chartSettings: ChartSettings, devicePixelRatio: number): Rect {
    const lpx = calcGridAreaLpx(divSize(canvasSizeCpx, devicePixelRatio), chartSettings);
    return mulRect(lpx, devicePixelRatio);
}
