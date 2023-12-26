import { Bounds } from "./basic-types";

type ArrayWithFirstTyped<V> = [V, ...any[]];

interface BinarySearchResult {
    l: number;
    r: number;
}

export function binarySearchByField<T, K extends keyof T>(data: T[], field: K, value: T[K]): BinarySearchResult {
    let r: number = data.length;
    let l = -1;
    let m: number;
    while (r - l > 1) {
        m = (r + l) >> 1;
        if (data[m][field] < value) l = m;
        else r = m;
    }

    return { l, r };
}

export function binarySearchByIndex0<T extends ArrayWithFirstTyped<V>, V>(data: T[], value: V): BinarySearchResult {
    return binarySearchByField(data, 0, value);
}

type DataPoint = [number, number | null];

export function visualDownsample(data: DataPoint[], bounds: Bounds, pnt_count: number): [number[], (number | null)[]] {
    const [min_x, max_x] = bounds;

    if (pnt_count <= 0) {
        return [[], []];
    }

    const left = binarySearchByIndex0(data, min_x).r;
    const right = binarySearchByIndex0(data, max_x).r;

    data = data.slice(Math.max(left - 1, 0), right + 1);

    const data_length = data.length;
    if (data_length <= pnt_count) {
        const x = new Array(data_length);
        const y = new Array(data_length);
        for (let i = 0; i < data_length; i++) {
            [x[i], y[i]] = data[i];
        }
        return [x, y];
    }

    const x_per_bucket = (max_x - min_x) / pnt_count;
    let bucket_l = min_x;
    bucket_l -= bucket_l % x_per_bucket;

    const outX = [data[0][0]],
        outY = [data[0][1]];
    let outputPos = 1;

    let i = 0;

    while (true) {
        const bucket_r = bucket_l + x_per_bucket;

        let max: DataPoint | null = null;
        let min: DataPoint | null = null;
        let first: DataPoint | null = null;
        let last: DataPoint | null = null;
        let first_null = false;
        let last_null = false;

        while (data[i] != null && i < data_length && data[i][0] < bucket_r) {
            const item = data[i];
            const [, value] = item;

            if (max == null || max[1] == null || (value != null && value > max[1])) max = item;
            if (min == null || min[1] == null || (value != null && value < min[1])) min = item;
            if (first == null) {
                if (value == null) first_null = true;
                first = item;
            }
            last_null = value == null;
            last = item;
            i++;
        }

        if (first_null) {
            [outX[outputPos], outY[outputPos++]] = [bucket_l, null];
        } else if (first != null) {
            [outX[outputPos], outY[outputPos++]] = first;
        }

        if (min != null && max != null) {
            if (min[0] < max[0]) {
                if (min[0] !== first?.[0]) {
                    [outX[outputPos], outY[outputPos++]] = min;
                }
                if (max[0] !== last?.[0]) {
                    [outX[outputPos], outY[outputPos++]] = max;
                }
            } else {
                if (max[0] !== first?.[0]) {
                    [outX[outputPos], outY[outputPos++]] = max;
                }
                if (min[0] !== last?.[0]) {
                    [outX[outputPos], outY[outputPos++]] = min;
                }
            }
        }

        if (last_null) {
            [outX[outputPos], outY[outputPos++]] = [bucket_r - 1, null];
        } else if (last != null) {
            [outX[outputPos], outY[outputPos++]] = last;
        }

        if (i >= data_length) break;

        bucket_l += x_per_bucket;
    }

    return [outX, outY];
}
