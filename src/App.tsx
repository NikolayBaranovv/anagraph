import React from "react";
import "./App.css";
import { Bounds } from "./lib/useDragAndZoom";
import { FPSIndicator, FPSManager } from "./lib/fps";
import { BoundsManager } from "./lib/BoundsManager";
import { Canvas } from "./lib/Canvas";
import { Background } from "./lib/Background";
import { generateRandomData } from "./lib/utils";
import { Grid } from "./lib/Grid";
import { Manipulator } from "./lib/Manipulator";
import { Line } from "./lib/Line";
import { LayoutManager } from "./lib/LayoutManager";
import { TimeXLegend } from "./lib/TimeXLegend";
import { YLegend } from "./lib/YLegend";

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
                    <Canvas className="graph">
                        <Manipulator />
                        <Background />
                        <Grid />
                        {graphData.map((graphData, i) => (
                            <Line data={graphData} key={i} />
                        ))}
                        <TimeXLegend />
                        <YLegend />
                    </Canvas>
                    <Canvas className="graph">
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
