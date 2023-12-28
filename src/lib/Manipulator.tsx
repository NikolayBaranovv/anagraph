import { CSSProperties, useState } from "react";
import { useDragAndZoom } from "./useDragAndZoom";
import { useBoundsContext } from "./BoundsManager";
import { Bounds } from "./basic-types";

interface ManipulatorProps {
    style: CSSProperties;
}

export function Manipulator(props: ManipulatorProps) {
    const { xBoundsLimit, settledXBounds, onManipulation, onManipulationEnd } = useBoundsContext();

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(glass, settledXBounds, onManipulation, onManipulationEnd, { boundsLimit: xBoundsLimit });

    return (
        <div
            className="glass"
            style={{
                position: "absolute",
                touchAction: "none",
                ...props.style,
            }}
            ref={setGlass}
        />
    );
}
