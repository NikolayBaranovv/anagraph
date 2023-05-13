import React, { useContext, useState } from "react";
import { BoundsContext } from "./BoundsManager";
import { useDragAndZoom } from "./useDragAndZoom";
import { useGridRectLpx } from "./LayoutManager";

export function Manipulator() {
    const boundsContext = useContext(BoundsContext);
    const gridLayout = useGridRectLpx();

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(glass, boundsContext.settledXBounds, boundsContext.onManipulation, boundsContext.onManipulationEnd);

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
