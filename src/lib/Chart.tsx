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
    addLineMessage,
    changeLineMessage,
    LineInfo,
    LineId,
    removeLineMessage,
    setCanvasMessage,
    setCanvasSizeMessage,
    setChartSettingsMessage,
    setXBoundsAndRedrawMessage,
    setDevicePixelRatioMessage,
} from "./chart-worker/chart-worker-messages";
import { useUnmount } from "react-use";
import { useBoundsContext } from "./BoundsManager";
import { Manipulator } from "./Manipulator";
import { DeepPartial, noop } from "ts-essentials";
import deepmerge from "deepmerge";
import { divSize, mulSize, Size } from "./basic-types";
import { calcGridAreaLpx, ChartSettings, defaultChartSettings } from "./settings-types";

interface ChartContextType {
    addLine(id: LineId, lineInfo: LineInfo): void;
    changeLine(id: LineId, lineInfo: Partial<LineInfo>): void;
    removeLine(id: LineId): void;
}

export const ChartContext = createContext<ChartContextType>({
    addLine: noop,
    changeLine: noop,
    removeLine: noop,
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

export function Chart(props: ChartProps) {
    const workerCreator = useWorkerCreator();
    const worker = useMemo(() => {
        console.log("CREATE WORKER");
        return workerCreator();
    }, [workerCreator]);
    useUnmount(() => worker.terminate());

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    const [canvasSizeCpx, setCanvasSizeCpx] = useState<Size>({ width: 100, height: 100 });

    const onCanvasResize = useCallback(
        function onCanvasResize(entries: ResizeObserverEntry[]) {
            if (canvas == null) return;
            const { inlineSize: width, blockSize: height } = entries[0].devicePixelContentBoxSize[0];
            setCanvasSizeCpx({ width, height });
            worker.postMessage(setCanvasSizeMessage(width, height));
        },
        [canvas, setCanvasSizeCpx],
    );

    const sizeObserver = useMemo(() => new ResizeObserver(onCanvasResize), [onCanvasResize]);
    useEffect(() => {
        if (canvas == null) return;
        sizeObserver.observe(canvas);
        return () => sizeObserver.unobserve(canvas);
    }, [canvas, sizeObserver]);

    useEffect(() => {
        if (canvas == null) return;

        const offscreenCanvas = canvas.transferControlToOffscreen();
        worker.postMessage(setCanvasMessage(offscreenCanvas, window.devicePixelRatio), [offscreenCanvas]);
    }, [canvas]);

    useEffect(() => {
        worker?.postMessage(setDevicePixelRatioMessage(window.devicePixelRatio));
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

    const chartContextValue = useMemo<ChartContextType>(
        () => ({
            addLine: (id, lineInfo) => worker.postMessage(addLineMessage(id, lineInfo)),
            changeLine: (id, lineInfo) => worker.postMessage(changeLineMessage(id, lineInfo)),
            removeLine: (id) => worker.postMessage(removeLineMessage(id)),
        }),
        [worker],
    );

    const gridAreaLpx = useMemo(
        () => calcGridAreaLpx(divSize(canvasSizeCpx, window.devicePixelRatio), effectiveSettings),
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
