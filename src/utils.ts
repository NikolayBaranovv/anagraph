import { Bounds } from "./useDragAndZoom";

export function scale(
    value: number,
    [oldMin, oldMax]: Bounds,
    [newMin, newMax]: Bounds
): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

export type GraphData = [number, number][];

export function generateRandomData(
    [minx, maxx]: Bounds,
    [miny, maxy]: Bounds,
    n: number,
    index: number
): GraphData {
    const data = new Array(n);
    for (let i = 0; i < n; i++) {
        const x = minx + ((maxx - minx) / n) * i;
        const y =
            (Math.sin((i / n) * 100 + index * 2 + Math.random()) / 2.1 + 0.5) *
                (maxy - miny) +
            miny;
        data[i] = [x, y];
    }
    return data;
}
