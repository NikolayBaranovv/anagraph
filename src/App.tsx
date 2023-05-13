import React from "react";
import "./App.css";
import { Bounds } from "./useDragAndZoom";
import { FPSIndicator, FPSManager } from "./fps";
import { BoundsManager } from "./BoundsManager";
import { Canvas } from "./Canvas";
import { Background } from "./Background";
import { generateRandomData } from "./utils";
import { Grid } from "./Grid";
import { Manipulator } from "./Manipulator";
import { Line } from "./Line";
import { LayoutManager } from "./LayoutManager";
import { TimeXLegend } from "./TimeXLegend";
import { YLegend } from "./YLegend";

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
