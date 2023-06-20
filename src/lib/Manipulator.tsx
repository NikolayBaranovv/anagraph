import React, { useState } from "react";
import { useBoundsContext } from "./BoundsManager";
import { useDragAndZoom } from "./useDragAndZoom";
import { useGridRectLpx } from "./LayoutManager";

export function Manipulator() {
    const { settledXBounds, onManipulation, onManipulationEnd } = useBoundsContext();
    const gridLayout = useGridRectLpx();

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(glass, settledXBounds, onManipulation, onManipulationEnd);

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
