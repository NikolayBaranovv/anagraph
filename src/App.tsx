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
import { Legends } from "./Legends";

const xBounds: Bounds = [0, 1000];
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
                        <Legends />
                    </Canvas>
                    <Canvas className="graph">
                        <Manipulator />
                        <Background />
                        <Grid />
                        {graphData.map((graphData, i) => (
                            <Line data={graphData} key={i} />
                        ))}
                        <Legends />
                    </Canvas>
                </BoundsManager>
            </LayoutManager>
        </FPSManager>
    );
}

export default App;
