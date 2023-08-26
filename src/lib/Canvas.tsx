import React, {
    createContext,
    CSSProperties,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { noop } from "ts-essentials";
import { useBoundsContext } from "./BoundsManager";
import { Size } from "./utils";
import { useCallbackList } from "./useCallbackList";
import { useIncFPSCounter } from "./fps";

type DrawCallback = (ctx: CanvasRenderingContext2D) => void;

interface CanvasContextType {
    canvasSizeCpx: Size;

    addDrawCallback: (fn: DrawCallback) => void;
    removeDrawCallback: (fn: DrawCallback) => void;
}

const CanvasContext = createContext<CanvasContextType>({
    canvasSizeCpx: { width: 100, height: 100 },

    addDrawCallback: noop,
    removeDrawCallback: noop,
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
        function onCanvasResize(entries: ResizeObserverEntry[]) {
            if (canvas == null) return;
            canvas.width = entries[0].devicePixelContentBoxSize[0].inlineSize;
            canvas.height = entries[0].devicePixelContentBoxSize[0].blockSize;
            setCanvasSizeCpx({ width: canvas.width, height: canvas.height });
        },
        [canvas, setCanvasSizeCpx],
    );

    const sizeObserver = useMemo(() => new ResizeObserver(onCanvasResize), [onCanvasResize]);

    useEffect(() => {
        if (canvas == null) return;
        sizeObserver.observe(canvas);
        return () => sizeObserver.unobserve(canvas);
    }, [canvas, sizeObserver]);

    const ctx: CanvasRenderingContext2D | null = useMemo(() => canvas?.getContext("2d") ?? null, [canvas]);

    const incFPSCounter = useIncFPSCounter();

    const redrawPlanned = useRef(false);
    const planRedraw = useCallback(
        function planRedraw() {
            if (redrawPlanned.current || !ctx) {
                return;
            }

            redrawPlanned.current = true;
            requestAnimationFrame(function raf() {
                redrawPlanned.current = false;
                const drawers = getDrawers();
                for (let i = 0, len = drawers.length; i < len; i++) {
                    ctx.save();
                    drawers[i](ctx);
                    ctx.restore();
                }
                incFPSCounter(ctx);
            });
        },
        [ctx, incFPSCounter],
    );

    const {
        addCallback: addDrawCallback,
        removeCallback: removeDrawCallback,
        getCallbacks: getDrawers,
    } = useCallbackList<DrawCallback>(planRedraw);

    const { addXBoundsCallback, removeXBoundsCallback } = useBoundsContext();
    useEffect(() => {
        addXBoundsCallback(planRedraw);
        return () => removeXBoundsCallback(planRedraw);
    }, [planRedraw]);

    const contextValue: CanvasContextType = { canvasSizeCpx, addDrawCallback, removeDrawCallback };
    const context = useMemo(() => contextValue, Object.values(contextValue));

    return (
        <div className={props.className} style={{ position: "relative", height: "350px", ...props.style }}>
            <canvas ref={setCanvas} style={{ width: "100%", height: "100%" }}></canvas>
            <CanvasContext.Provider value={context}>{props.children}</CanvasContext.Provider>
        </div>
    );
}

export function useCanvasContext(): CanvasContextType {
    return useContext(CanvasContext);
}

export function useDrawCallback(fn: DrawCallback): void {
    const { addDrawCallback, removeDrawCallback } = useCanvasContext();
    useEffect(() => {
        addDrawCallback(fn);
        return () => removeDrawCallback(fn);
    }, [addDrawCallback, removeDrawCallback, fn]);
}
