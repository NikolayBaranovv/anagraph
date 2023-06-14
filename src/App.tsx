import React from "react";
import { Bounds } from "./lib/useDragAndZoom";
import {
    Background,
    BoundsManager,
    Canvas,
    FPSIndicator,
    FPSManager,
    Grid,
    LayoutManager,
    Line,
    Manipulator,
    TimeXLegend,
    YLegend,
} from "./lib";
import { generateRandomData } from "./lib/utils";

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const xBounds: Bounds = [todayStart.getTime(), todayStart.getTime() + 31 * 24 * 60 * 60 * 1e3];
const yBounds: Bounds = [-100, 100];
const n = 60 * 24 * 31;
const nGraphs = 3;

const graphData = new Array(nGraphs).fill(0).map((_, index) => generateRandomData(xBounds, yBounds, n, index));

function App() {
    return (
        <FPSManager>
            <LayoutManager>
                <BoundsManager initialXBounds={xBounds} yBounds={yBounds}>
                    <FPSIndicator />
                    <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0", marginBottom: "12px" }}>
                        <Manipulator />
                        <Background />
                        <Grid />
                        {graphData.map((graphData, i) => (
                            <Line data={graphData} key={i} />
                        ))}
                        <TimeXLegend />
                        <YLegend />
                    </Canvas>
                    <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0", marginBottom: "12px" }}>
                        <Manipulator />
                        <Background />
                        <Grid />
                        {graphData.map((graphData, i) => (
                            <Line data={graphData} key={i} />
                        ))}
                        <TimeXLegend />
                        <YLegend />
                    </Canvas>
                </BoundsManager>
            </LayoutManager>
        </FPSManager>
    );
}

export default App;
