import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Bounds } from "./useDragAndZoom";

interface CanvasContextType {
    ctx: CanvasRenderingContext2D | null;
    width: number;
    height: number;
}

export const CanvasContext = createContext<CanvasContextType>({
    ctx: null,
    width: 100,
    height: 100,
});

interface CanvasProps {
    className?: string;
    children: React.ReactNode | ReactNode[];
}

export function Canvas(props: CanvasProps) {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    const [size, setSize] = useState<Bounds>([100, 100]);

    const onCanvasResize = useCallback(
        (entries: ResizeObserverEntry[]) => {
            if (canvas == null) return;
            canvas.width = entries[0].devicePixelContentBoxSize[0].inlineSize;
            canvas.height = entries[0].devicePixelContentBoxSize[0].blockSize;
            setSize([canvas.width, canvas.height]);
        },
        [canvas, setSize]
    );

    const sizeObserver = useMemo(
        () => new ResizeObserver(onCanvasResize),
        [onCanvasResize]
    );

    useEffect(() => {
        if (canvas == null) return;
        sizeObserver.observe(canvas);
        return () => sizeObserver.unobserve(canvas);
    }, [canvas, sizeObserver]);

    const ctx: CanvasRenderingContext2D | null = useMemo(
        () => canvas?.getContext("2d") ?? null,
        [canvas]
    );

    const context: CanvasContextType = useMemo(
        () => ({
            ctx,
            width: size[0],
            height: size[1],
        }),
        [ctx, size]
    );

    return (
        <div className={props.className} style={{ position: "relative" }}>
            <CanvasContext.Provider value={context}>
                <canvas
                    ref={setCanvas}
                    style={{ width: "100%", height: "100%" }}
                ></canvas>
                {props.children}
            </CanvasContext.Provider>
        </div>
    );
}
