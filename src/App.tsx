import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import "./App.css";
import { Bounds, useDragAndZoom } from "./useDragAndZoom";
import { visualDownsample } from "./downsample";
import { FPSContext, FPSIndicator, FPSManager } from "./fps";
import { BoundsContext, BoundsManager } from "./bounds";

function scale(
    value: number,
    [oldMin, oldMax]: Bounds,
    [newMin, newMax]: Bounds
): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

function Background() {
    const boundsContext = useContext(BoundsContext);

    const { ctx, width, height } = useContext(CanvasContext);

    const drawer = useCallback(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}

const log10_5 = Math.log10(5);
const log10_4 = Math.log10(4);
const log10_2 = Math.log10(2);

function* generateTicks(
    range: Bounds,
    pixels: number,
    minPixels: number
): Generator<number> {
    const xRange = range[1] - range[0];

    const targetXStepLog = Math.log10((xRange / pixels) * minPixels);
    let xStepLog = Math.ceil(targetXStepLog);
    if (xStepLog - targetXStepLog > log10_5) xStepLog -= log10_5;
    else if (xStepLog - targetXStepLog > log10_4) xStepLog -= log10_4;
    else if (xStepLog - targetXStepLog > log10_2) xStepLog -= log10_2;
    const xStep = Math.pow(10, xStepLog);

    const xMin = Math.ceil(range[0] / xStep) * xStep;
    const xMax = Math.floor(range[1] / xStep) * xStep;

    for (let x = xMin; x <= xMax; x += xStep) {
        yield x;
    }
}

function Grid() {
    const boundsContext = useContext(BoundsContext);
    const { ctx, width, height } = useContext(CanvasContext);

    const drawer = useCallback(
        (xBounds: Bounds) => {
            if (!ctx) return;

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 1;

            for (const y of generateTicks(boundsContext.yBounds, height, 50)) {
                const ypx =
                    Math.round(scale(y, boundsContext.yBounds, [0, height])) +
                    0.5;
                ctx.beginPath();
                ctx.moveTo(0, ypx);
                ctx.lineTo(width, ypx);
                ctx.stroke();
            }

            for (const x of generateTicks(xBounds, width, 50)) {
                const xpx = Math.round(scale(x, xBounds, [0, width])) + 0.5;
                ctx.beginPath();
                ctx.moveTo(xpx, 0);
                ctx.lineTo(xpx, height);
                ctx.stroke();
            }
        },
        [ctx, width, height, boundsContext.yBounds]
    );

    useEffect(() => {
        boundsContext.addXBoundsCallback(drawer);
        return () => boundsContext.removeXBoundsCallback(drawer);
    }, [boundsContext, drawer]);

    return null;
}

interface CanvasContextType {
    ctx: CanvasRenderingContext2D | null;
    width: number;
    height: number;
}

const CanvasContext = createContext<CanvasContextType>({
    ctx: null,
    width: 100,
    height: 100,
});

interface CanvasProps {
    className?: string;
    children: React.ReactNode | ReactNode[];
}

function Canvas(props: CanvasProps) {
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

function Manipulator() {
    const boundsContext = useContext(BoundsContext);

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(
        glass,
        boundsContext.settledXBounds,
        boundsContext.onManipulation,
        boundsContext.onManipulationEnd
    );

    return (
        <div
            className="glass"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            ref={setGlass}
        />
    );
}

interface LineProps {
    data: GraphData;
}

function Line(props: LineProps) {
    const boundsContext = useContext(BoundsContext);

    const incFrameCounter = useContext(FPSContext).incCounter;

    const { ctx, width, height } = useContext(CanvasContext);

    const grad = useMemo(() => {
        if (ctx == null) {
            return null;
        }

        const grd = ctx.createLinearGradient(0, height, 0, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "blue");
        return grd;
    }, [ctx, height]);

    const [ymin, ymax] = boundsContext.yBounds;

    const draw = useCallback(
        (effectiveXBounds: Bounds) => {
            if (props.data.length === 0 || !ctx || !grad) return;

            const downsampled = visualDownsample(
                props.data,
                effectiveXBounds,
                width
            );

            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";
            ctx.strokeStyle = grad;

            const scaled = downsampled.map(
                ([x, y]): [number, number | null] => [
                    scale(x, effectiveXBounds, [0, width]),
                    y == null ? null : scale(y, [ymin, ymax], [0, height]),
                ]
            );

            for (let i = 0; i < scaled.length - 1; i++) {
                const [x1, y1] = scaled[i];
                const [x2, y2] = scaled[i + 1];
                if (y1 == null || y2 == null) continue;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            incFrameCounter();
        },
        [ctx, width, height, grad, props.data, ymin, ymax, incFrameCounter]
    );

    useEffect(() => {
        boundsContext.addXBoundsCallback(draw);
        return () => boundsContext.removeXBoundsCallback(draw);
    }, [boundsContext, draw]);

    return null;
}

type GraphData = [number, number][];

function generateRandomData(
    [minx, maxx]: Bounds,
    [miny, maxy]: Bounds,
    n: number,
    index: number
): GraphData {
    const data = new Array(n);
    for (let i = 0; i < n; i++) {
        const x = minx + ((maxx - minx) / n) * i;
        const y =
            (Math.sin((i / n) * 100 + index * 2 + Math.random()) / 2.1 + 0.5) *
                (maxy - miny) +
            miny;
        data[i] = [x, y];
    }
    return data;
}

const xBounds: Bounds = [0, 1000];
const yBounds: Bounds = [-100, 100];
const n = 60 * 24 * 31;
const nGraphs = 3;

const graphData = new Array(nGraphs)
    .fill(0)
    .map((_, index) => generateRandomData(xBounds, yBounds, n, index));

function App() {
    return (
        <FPSManager>
            <BoundsManager initialXBounds={xBounds} yBounds={yBounds}>
                <FPSIndicator />
                <Canvas className="graph">
                    <Manipulator />
                    <Background />
                    <Grid />
                    {graphData.map((graphData, i) => (
                        <Line data={graphData} key={i} />
                    ))}
                </Canvas>
            </BoundsManager>
        </FPSManager>
    );
}

export default App;
