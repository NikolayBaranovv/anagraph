import React, {
    createContext,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { noop } from "ts-essentials";
import { Bounds } from "./useDragAndZoom";
import { useCallbackList } from "./useCallbackList";

type BoundsHandler = (xBounds: Bounds) => void;

interface BoundsContextType {
    addXBoundsCallback(fn: BoundsHandler): void;

    removeXBoundsCallback(fn: BoundsHandler): void;

    settledXBounds: Bounds;

    onManipulation(bounds: Bounds): void;

    onManipulationEnd(bounds: Bounds): void;

    getCurrentXBounds(): Bounds;
}

const BoundsContext = createContext<BoundsContextType>({
    addXBoundsCallback: noop,
    removeXBoundsCallback: noop,

    settledXBounds: [0, 1],

    onManipulation: noop,
    onManipulationEnd: noop,

    getCurrentXBounds: () => [0, 1],
});

interface BoundsManagerProps {
    initialXBounds: Bounds;

    children: ReactNode | ReactNode[];
}

export function BoundsManager(props: BoundsManagerProps): ReactElement {
    const {
        addCallback: addXBoundsCallback,
        removeCallback: removeXBoundsCallback,
        callCallbacks: callXBoundsCallbacks,
    } = useCallbackList<BoundsHandler>();

    const [finalXBounds, setFinalXBounds] = useState<Bounds>(props.initialXBounds);
    const finalXBoundsRef = useRef(props.initialXBounds);
    const tmpXBounds = useRef<Bounds | null>(null);

    const getCurrentXBounds = useRef(() => tmpXBounds.current ?? finalXBoundsRef.current).current;

    const onManipulation = useCallback(
        (bounds: Bounds) => {
            tmpXBounds.current = bounds;
            callXBoundsCallbacks(bounds);
        },
        [callXBoundsCallbacks]
    );
    const onManipulationEnd = useCallback(
        (bounds: Bounds) => {
            tmpXBounds.current = null;
            finalXBoundsRef.current = bounds;
            setFinalXBounds(bounds);
            callXBoundsCallbacks(bounds);
        },
        [setFinalXBounds, callXBoundsCallbacks]
    );

    const contextValue: BoundsContextType = {
        addXBoundsCallback,
        removeXBoundsCallback,
        onManipulation,
        onManipulationEnd,
        settledXBounds: finalXBounds,
        getCurrentXBounds,
    };
    const context = useMemo(() => contextValue, Object.values(contextValue));

    return <BoundsContext.Provider value={context}>{props.children}</BoundsContext.Provider>;
}

export function useBoundsContext(): BoundsContextType {
    return useContext(BoundsContext);
}
