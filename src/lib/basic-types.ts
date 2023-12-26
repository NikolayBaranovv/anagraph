export type Bounds = Readonly<[number, number]>;
export type LineData = [number, number][];

export interface Size {
    width: number;
    height: number;
}

export function mulSize(size: Size, mul: number): Size {
    return { width: size.width * mul, height: size.height * mul };
}

export function divSize(size: Size, div: number): Size {
    return { width: size.width / div, height: size.height / div };
}

export interface Offset {
    x: number;
    y: number;
}

export type Rect = Offset & Size;

export function mulRect(rect: Rect, mul: number): Rect {
    return { x: rect.x * mul, y: rect.y * mul, width: rect.width * mul, height: rect.height * mul };
}

export function divRect(rect: Rect, div: number): Rect {
    return { x: rect.x / div, y: rect.y / div, width: rect.width / div, height: rect.height / div };
}
