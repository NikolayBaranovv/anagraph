import React, { useState } from "react";
import { useBoundsContext } from "../lib/BoundsManager";
import { useDragAndZoom } from "../lib/useDragAndZoom";
import { useGridRectLpx } from "./LayoutManager";

import { Bounds } from "../lib";

export function Manipulator() {
    const { xBoundsLimit, settledXBounds, onManipulation, onManipulationEnd } = useBoundsContext();
    const gridLayout = useGridRectLpx();

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(glass, settledXBounds, onManipulation, onManipulationEnd, { boundsLimit: xBoundsLimit });

    return (
        <div
            className="glass"
            style={{
                position: "absolute",
                top: gridLayout.y,
                left: gridLayout.x,
                width: gridLayout.width,
                height: gridLayout.height,
                touchAction: "none",
            }}
            ref={setGlass}
        />
    );
}
