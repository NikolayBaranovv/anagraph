import { CSSProperties, useState } from "react";
import { useDragAndZoom } from "./useDragAndZoom";
import { useBoundsContext } from "./BoundsManager";
import { Bounds } from "./basic-types";

interface ManipulatorProps {
    style: CSSProperties;
    onCursorMove?: (x: number) => void;
}

export function Manipulator(props: ManipulatorProps) {
    const { onCursorMove } = props;
    const { xBoundsLimit, settledXBounds, onManipulation, onManipulationEnd } = useBoundsContext();

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(glass, settledXBounds, onManipulation, onManipulationEnd, onCursorMove, {
        boundsLimit: xBoundsLimit,
    });

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
