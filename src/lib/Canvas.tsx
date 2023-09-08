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
import { useSetFPSCounter } from "./fps";

import { DrawingInstruction, Size } from "./drawing-types";
import { useLatest } from "react-use";
import { useWorkerUrl } from "./WorkerUrlContext";
import {
    setCanvasMessage,
    setCanvasSizeMessage,
    setInstructionsMessage,
    setXBoundsAndRedrawMessage,
    WorkerToMainMessage,
} from "./worker-messages";
import { assertNever } from "./utils";

interface CanvasContextType {
    canvasSizeCpx: Size;

    addDrawingInstruction: (instructions: DrawingInstruction) => void;
    removeDrawingInstruction: (instructions: DrawingInstruction) => void;
}

const CanvasContext = createContext<CanvasContextType>({
    canvasSizeCpx: { width: 100, height: 100 },

    addDrawingInstruction: noop,
    removeDrawingInstruction: noop,
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
            const { inlineSize: width, blockSize: height } = entries[0].devicePixelContentBoxSize[0];
            setCanvasSizeCpx({ width, height });
            latestWorker.current?.postMessage(setCanvasSizeMessage(width, height));
            planRedraw.current();
        },
        [canvas, setCanvasSizeCpx],
    );

    const sizeObserver = useMemo(() => new ResizeObserver(onCanvasResize), [onCanvasResize]);

    useEffect(() => {
        if (canvas == null) return;
        sizeObserver.observe(canvas);
        return () => sizeObserver.unobserve(canvas);
    }, [canvas, sizeObserver]);

    // const ctx: CanvasRenderingContext2D | null = useMemo(() => canvas?.getContext("2d") ?? null, [canvas]);

    // const worker = useRef<Workerized<typeof WorkerType> | null>(null);
    const [worker, setWorker] = useState<Worker | null>(null);

    const workerUrl = useWorkerUrl();

    useEffect(() => {
        if (canvas == null) return;

        const wrk = new Worker(workerUrl);
        const offscreenCanvas = canvas.transferControlToOffscreen();
        wrk.postMessage(setCanvasMessage(offscreenCanvas, window.devicePixelRatio), [offscreenCanvas]);
        setWorker(wrk);
        sendInstructions.current();

        return () => {
            wrk.terminate();
        };
    }, [canvas]);

    const setFPSCounter = useSetFPSCounter();

    useEffect(() => {
        function onMessage(event: MessageEvent<WorkerToMainMessage>) {
            if (!worker) return;

            switch (event.data.type) {
                case "stats": {
                    setFPSCounter(worker, event.data.fps);
                    break;
                }

                default: {
                    assertNever(event.data.type);
                }
            }
        }
        worker?.addEventListener("message", onMessage);
        return () => {
            worker?.removeEventListener("message", onMessage);
        };
    }, [worker]);

    const latestWorker = useLatest(worker);

    const sendInstructions = useRef(() => {
        sendInstructionsPlanned.current = false;
        if (latestWorker.current == null) return;

        latestWorker.current?.postMessage(setInstructionsMessage(instructions.current));
        planRedraw.current();
    });
    const sendInstructionsPlanned = useRef(false);
    const planSendInstructions = useCallback(() => {
        if (!sendInstructionsPlanned.current) {
            sendInstructionsPlanned.current = true;
            requestAnimationFrame(sendInstructions.current);
        }
    }, []);

    useEffect(() => {
        if (worker) {
            worker.postMessage(setCanvasSizeMessage(canvasSizeCpx.width, canvasSizeCpx.height));
            sendInstructions.current();
            planRedraw.current();
        }
    }, [worker]);

    const { getCurrentXBounds } = useBoundsContext();

    const planRedraw = useRef(() => {
        latestWorker.current?.postMessage(setXBoundsAndRedrawMessage(getCurrentXBounds()));
    });

    const instructions = useRef<DrawingInstruction[]>([]);
    const addDrawingInstruction = useCallback((instruction: DrawingInstruction) => {
        instructions.current.push(instruction);
        planSendInstructions();
    }, []);
    const removeDrawingInstruction = useCallback((instruction: DrawingInstruction) => {
        const index = instructions.current.indexOf(instruction);
        if (index !== -1) {
            instructions.current.splice(index, 1);
            planSendInstructions();
        }
    }, []);

    const { addXBoundsCallback, removeXBoundsCallback } = useBoundsContext();
    useEffect(() => {
        addXBoundsCallback(planRedraw.current);
        return () => removeXBoundsCallback(planRedraw.current);
    }, []);

    const contextValue: CanvasContextType = {
        canvasSizeCpx,
        addDrawingInstruction,
        removeDrawingInstruction,
    };
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

export function useDrawingInstruction(instruction: DrawingInstruction): void {
    const { addDrawingInstruction, removeDrawingInstruction } = useCanvasContext();
    useEffect(() => {
        addDrawingInstruction(instruction);
        return () => {
            removeDrawingInstruction(instruction);
        };
    }, [addDrawingInstruction, removeDrawingInstruction, instruction]);
}
