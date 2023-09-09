import React from "react";
import {
    Background,
    Bounds,
    BoundsManager,
    Canvas,
    FPSIndicator,
    FPSManager,
    Grid,
    LayoutManager,
    Line,
    Manipulator,
    TimeXLegend,
    WorkerCreatorProvider,
    YAxisProvider,
    YLegend,
} from "./lib";
import { generateRandomData } from "./lib/utils";

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const xBounds: Bounds = [todayStart.getTime(), todayStart.getTime() + 31 * 24 * 60 * 60 * 1e3];
const yBounds: Bounds = [-100, 100];
const n = 60 * 24 * 31;
const nGraphs = 3;

const graphData1 = new Array(nGraphs).fill(0).map((_, index) => generateRandomData(xBounds, yBounds, n, index));
const graphData2 = new Array(nGraphs).fill(0).map((_, index) => generateRandomData(xBounds, yBounds, n, index));

function App() {
    return (
        <FPSManager>
            <WorkerCreatorProvider workerCreator={() => new Worker("./worker.js")}>
                <LayoutManager>
                    <BoundsManager initialXBounds={xBounds}>
                        <YAxisProvider bounds={yBounds}>
                            <FPSIndicator />
                            <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0", marginBottom: "12px" }}>
                                <Manipulator boundsLimit={xBounds} />
                                <Background />
                                <Grid />
                                {graphData1.map((graphData, i) => (
                                    <Line data={graphData} key={i} color="#c4443b" />
                                ))}
                                <TimeXLegend />
                                <YLegend />
                            </Canvas>

                            <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0", marginBottom: "12px" }}>
                                <Manipulator boundsLimit={xBounds} />
                                <Background />
                                <Grid />
                                {graphData2.map((graphData, i) => (
                                    <Line data={graphData} key={i} color="#3993DD" />
                                ))}
                                <TimeXLegend />
                                <YLegend />
                            </Canvas>
                        </YAxisProvider>
                    </BoundsManager>
                </LayoutManager>
            </WorkerCreatorProvider>
        </FPSManager>
    );
}

export default App;
