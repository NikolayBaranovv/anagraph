// Inspired by https://flut1.medium.com/deep-flatten-typescript-types-with-finite-recursion-cb79233d93ca

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type NonObjectKeysOf<T> = {
    [K in keyof T]: T[K] extends Readonly<Array<any>> ? K : T[K] extends object ? never : K;
}[keyof T];

type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T> = Exclude<Extract<ValuesOf<T>, object>, Readonly<Array<any>>>;

type Flatten<T> = Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<ObjectValuesOf<T>>;

type ConcatKeys<A extends string, B> = A extends "" ? B : `${A}.${B & string}`;

export type Prefix<T, P extends string> = {
    [K in keyof T as ConcatKeys<P, K>]: T[K] extends Readonly<Array<any>>
        ? T[K]
        : T[K] extends object
        ? Flatten<Prefix<T[K], ConcatKeys<P, K>>>
        : T[K];
};

export type DeepFlatten<T> = Flatten<Prefix<T, "">>;

export function flatten<T>(obj: T): DeepFlatten<T> {
    let result: Record<string, any> = {};
    for (const i in obj) {
        if (obj[i] != null && typeof obj[i] === "object" && !Array.isArray(obj[i])) {
            const temp: any = flatten(obj[i]);
            for (const j in temp) {
                result[i + "." + j] = temp[j];
            }
        } else {
            result[i] = obj[i];
        }
    }
    return result as DeepFlatten<T>;
}

export function unflatten<T extends object>(data: DeepFlatten<T>): T {
    const result = {};
    for (let i in data) {
        const v = (data as Record<string, any>)[i];
        const keys = i.split(".");
        keys.reduce((r: any, e: string, j: number) => {
            return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? v : {}) : []);
        }, result);
    }
    return result as T;
}
