import { CSSProperties, useState } from "react";
import { useDragAndZoom } from "./useDragAndZoom";
import { useBoundsContext } from "./BoundsManager";
import { Bounds } from "./basic-types";

interface ManipulatorProps {
    style: CSSProperties;
    onHover?: (x: number, event: PointerEvent) => void;
}

export function Manipulator(props: ManipulatorProps) {
    const { onHover } = props;
    const { xBoundsLimit, settledXBounds, onManipulation, onManipulationEnd } = useBoundsContext();

    const [glass, setGlass] = useState<HTMLDivElement | null>(null);

    useDragAndZoom(glass, settledXBounds, onManipulation, onManipulationEnd, onHover, {
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
