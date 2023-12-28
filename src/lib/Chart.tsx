import React, {
    createContext,
    CSSProperties,
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useWorkerCreator } from "./WorkerCreatorContext";
import {
    MainToChartWorkerMessage,
    setCanvasMessage,
    setCanvasSizeMessage,
    setChartSettingsMessage,
    setXBoundsAndRedrawMessage,
} from "./chart-worker/messages";
import { useUnmount } from "react-use";
import { useBoundsContext } from "./BoundsManager";
import { Manipulator } from "./Manipulator";
import { DeepPartial, noop } from "ts-essentials";
import deepmerge from "deepmerge";
import { divSize, Size } from "./basic-types";
import { ChartSettings, defaultChartSettings } from "./settings-types";
import { BottomStatus, Id, LineInfo, VerticalFilling } from "./chart-worker/worker-types";
import { calcManipulationAreaLpx } from "./layout-utils";

interface ChartContextType {
    addLine(id: Id, lineInfo: LineInfo): void;
    changeLine(id: Id, lineInfo: Partial<LineInfo>): void;
    removeLine(id: Id): void;

    addVerticalFilling(id: Id, verticalFilling: VerticalFilling): void;
    changeVerticalFilling(id: Id, verticalFilling: Partial<VerticalFilling>): void;
    removeVerticalFilling(id: Id): void;

    addBottomStatus(id: Id, bottomStatus: BottomStatus): void;
    changeBottomStatus(id: Id, bottomStatus: Partial<BottomStatus>): void;
    removeBottomStatus(id: Id): void;
}

export const ChartContext = createContext<ChartContextType>({
    addLine: noop,
    changeLine: noop,
    removeLine: noop,

    addVerticalFilling: noop,
    changeVerticalFilling: noop,
    removeVerticalFilling: noop,

    addBottomStatus: noop,
    changeBottomStatus: noop,
    removeBottomStatus: noop,
});

export function useChartContext(): ChartContextType {
    return useContext(ChartContext);
}

interface ChartProps {
    className?: string;
    style?: CSSProperties;
    settings?: DeepPartial<ChartSettings>;

    children?: ReactElement[];
}

function overwriteMerge<T>(_: T[], sourceArray: T[]): T[] {
    return sourceArray;
}

function useWorker() {
    const workerCreator = useWorkerCreator();
    const worker = useMemo(() => workerCreator(), [workerCreator]);
    useUnmount(() => worker.terminate());
    return worker;
}

function useCanvas(onResize: (sizeCpx: Size) => void) {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    const [canvasSizeCpx, setCanvasSizeCpx] = useState<Size>({ width: 100, height: 100 });

    const onCanvasResize = useCallback(
        function onCanvasResize(entries: ResizeObserverEntry[]) {
            if (canvas == null) return;
            const { inlineSize: width, blockSize: height } = entries[0].devicePixelContentBoxSize[0];
            setCanvasSizeCpx({ width, height });
            onResize({ width, height });
        },
        [canvas, setCanvasSizeCpx, onResize],
    );

    const sizeObserver = useMemo(() => new ResizeObserver(onCanvasResize), [onCanvasResize]);
    useEffect(() => {
        if (canvas == null) return;
        sizeObserver.observe(canvas);
        return () => sizeObserver.unobserve(canvas);
    }, [canvas, sizeObserver]);

    return { canvas, setCanvas, canvasSizeCpx };
}

export function Chart(props: ChartProps) {
    const worker = useWorker();

    const onCanvasResize = useCallback(
        (sizeCpx: Size) => worker.postMessage(setCanvasSizeMessage(sizeCpx.width, sizeCpx.height)),
        [worker],
    );

    const { canvas, setCanvas, canvasSizeCpx } = useCanvas(onCanvasResize);

    useEffect(() => {
        if (canvas == null) return;

        const offscreenCanvas = canvas.transferControlToOffscreen();
        worker.postMessage(setCanvasMessage(offscreenCanvas, window.devicePixelRatio), [offscreenCanvas]);
    }, [canvas]);

    useEffect(() => {
        worker?.postMessage(setCanvasMessage(undefined, window.devicePixelRatio));
    }, [window.devicePixelRatio]);

    const effectiveSettings = useMemo(
        () =>
            deepmerge<ChartSettings, DeepPartial<ChartSettings>>(defaultChartSettings, props.settings ?? {}, {
                arrayMerge: overwriteMerge,
            }),
        [props.settings],
    );

    useEffect(() => {
        worker.postMessage(setChartSettingsMessage(effectiveSettings));
        sendRedraw.current();
    }, [worker]);

    const { getCurrentXBounds, addXBoundsCallback, removeXBoundsCallback } = useBoundsContext();
    const sendRedraw = useRef(() => {
        worker.postMessage(setXBoundsAndRedrawMessage(getCurrentXBounds()));
    });
    useEffect(() => {
        addXBoundsCallback(sendRedraw.current);
        return () => removeXBoundsCallback(sendRedraw.current);
    }, []);

    const sendMessage = useCallback(
        (message: MainToChartWorkerMessage) => {
            worker.postMessage(message);
        },
        [worker],
    );

    const chartContextValue = useMemo<ChartContextType>(
        () => ({
            addLine: (id, lineInfo) => sendMessage({ type: "addLine", id, attrs: lineInfo }),
            changeLine: (id, lineInfo) => sendMessage({ type: "changeLine", id, attrs: lineInfo }),
            removeLine: (id) => sendMessage({ type: "removeLine", id }),

            addVerticalFilling: (id, verticalFilling) =>
                sendMessage({ type: "addVerticalFilling", id, attrs: verticalFilling }),
            changeVerticalFilling: (id, verticalFilling) =>
                sendMessage({ type: "changeVerticalFilling", id, attrs: verticalFilling }),
            removeVerticalFilling: (id) => sendMessage({ type: "removeVerticalFilling", id }),

            addBottomStatus: (id, bottomStatus) => sendMessage({ type: "addBottomStatus", id, attrs: bottomStatus }),
            changeBottomStatus: (id, bottomStatus) =>
                sendMessage({ type: "changeBottomStatus", id, attrs: bottomStatus }),
            removeBottomStatus: (id) => sendMessage({ type: "removeBottomStatus", id }),
        }),
        [worker],
    );

    const gridAreaLpx = useMemo(
        () => calcManipulationAreaLpx(divSize(canvasSizeCpx, window.devicePixelRatio), effectiveSettings),
        [canvasSizeCpx, effectiveSettings],
    );

    return (
        <div className={props.className} style={{ position: "relative", height: "350px", ...props.style }}>
            <canvas ref={setCanvas} style={{ width: "100%", height: "100%" }} />
            <Manipulator
                style={{
                    top: gridAreaLpx.y,
                    left: gridAreaLpx.x,
                    width: gridAreaLpx.width,
                    height: gridAreaLpx.height,
                }}
            />
            <ChartContext.Provider value={chartContextValue}>{props.children}</ChartContext.Provider>
        </div>
    );
}
