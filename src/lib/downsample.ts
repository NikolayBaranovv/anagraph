import { Bounds } from "./useDragAndZoom";

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

let totalCnt = 0;
let totalMs = 0;

// @ts-ignore
window.qqq = () => {
    console.log("total cnt", totalCnt, "ms", totalMs, totalMs / totalCnt);
    totalCnt = 0;
    totalMs = 0;
};

export function visualDownsample(data: DataPoint[], [min_x, max_x]: Bounds, pnt_count: number): DataPoint[] {
    // console.time("visualDownsample");
    totalMs -= performance.now();
    try {
        if (pnt_count <= 0) return [];

        const left = binarySearchByIndex0(data, min_x).r;
        const right = binarySearchByIndex0(data, max_x).r;

        data = data.slice(Math.max(left - 1, 0), right + 1);

        const data_length = data.length;
        if (data_length <= pnt_count) return data;

        const x_per_bucket = (max_x - min_x) / pnt_count;
        let bucket_l = min_x;
        bucket_l -= bucket_l % x_per_bucket;

        const output: DataPoint[] = [data[0]];
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

                if (max == null || max[1] == null || (item[1] != null && item[1] > max[1])) max = item;
                if (min == null || min[1] == null || (item[1] != null && item[1] < min[1])) min = item;
                if (first == null) {
                    if (item[1] == null) first_null = true;
                    first = item;
                }
                last_null = item[1] == null;
                last = item;
                i++;
            }

            if (first_null) {
                // output.push([bucket_l, null]);
                output[outputPos++] = [bucket_l, null];
            } else if (first != null) {
                // output.push(first);
                output[outputPos++] = first;
            }

            if (min != null && max != null) {
                if (min[0] < max[0]) {
                    if (min[0] !== first?.[0]) {
                        // output.push(min);
                        output[outputPos++] = min;
                    }
                    if (max[0] !== last?.[0]) {
                        // output.push(max);
                        output[outputPos++] = max;
                    }
                } else {
                    if (max[0] !== first?.[0]) {
                        // output.push(max);
                        output[outputPos++] = max;
                    }
                    if (min[0] !== last?.[0]) {
                        // output.push(min);
                        output[outputPos++] = min;
                    }
                }
            }

            if (last_null) {
                // output.push([bucket_r - 1, null]);
                output[outputPos++] = [bucket_r - 1, null];
            } else if (last != null) {
                // output.push(last);
                output[outputPos++] = last;
            }

            if (i >= data_length) break;

            bucket_l += x_per_bucket;
        }

        return output;
    } finally {
        totalMs += performance.now();
        totalCnt++;
    }
}
