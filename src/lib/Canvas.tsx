import React, {
    createContext,
    CSSProperties,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Size } from "./utils";

interface CanvasContextType {
    ctx: CanvasRenderingContext2D | null;
    canvasSizeCpx: Size;
}

export const CanvasContext = createContext<CanvasContextType>({
    ctx: null,
    canvasSizeCpx: { width: 100, height: 100 },
});

interface CanvasProps {
    style?: CSSProperties;
    className?: string;
    children: React.ReactNode | ReactNode[];
}

export function Canvas(props: CanvasProps): ReactElement {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    const [canvasSizeCpx, setCanvasSizeCpx] = useState<Size>({ width: 100, height: 100 });

    const onCanvasResize = useCallback(
        (entries: ResizeObserverEntry[]) => {
            if (canvas == null) return;
            canvas.width = entries[0].devicePixelContentBoxSize[0].inlineSize;
            canvas.height = entries[0].devicePixelContentBoxSize[0].blockSize;
            setCanvasSizeCpx({ width: canvas.width, height: canvas.height });
        },
        [canvas, setCanvasSizeCpx]
    );

    const sizeObserver = useMemo(() => new ResizeObserver(onCanvasResize), [onCanvasResize]);

    useEffect(() => {
        if (canvas == null) return;
        sizeObserver.observe(canvas);
        return () => sizeObserver.unobserve(canvas);
    }, [canvas, sizeObserver]);

    const ctx: CanvasRenderingContext2D | null = useMemo(() => canvas?.getContext("2d") ?? null, [canvas]);

    const context: CanvasContextType = useMemo(() => ({ ctx, canvasSizeCpx }), [ctx, canvasSizeCpx]);

    return (
        <div className={props.className} style={{ position: "relative", height: "350px", ...props.style }}>
            <CanvasContext.Provider value={context}>
                <canvas ref={setCanvas} style={{ width: "100%", height: "100%" }}></canvas>
                {props.children}
            </CanvasContext.Provider>
        </div>
    );
}
