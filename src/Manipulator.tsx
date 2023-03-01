import React, { useContext, useState } from "react";
import { BoundsContext } from "./BoundsManager";
import { useDragAndZoom } from "./useDragAndZoom";

export function Manipulator() {
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
                touchAction: "none",
            }}
            ref={setGlass}
        />
    );
}
