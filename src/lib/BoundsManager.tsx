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

type BoundsHandler = (xBounds: Bounds) => void;

interface BoundsContextType {
    addXBoundsCallback(fn: BoundsHandler): void;

    removeXBoundsCallback(fn: BoundsHandler): void;

    settledXBounds: Bounds;

    onManipulation(bounds: Bounds): void;

    onManipulationEnd(bounds: Bounds): void;
}

const BoundsContext = createContext<BoundsContextType>({
    addXBoundsCallback: noop,
    removeXBoundsCallback: noop,

    settledXBounds: [0, 1],

    onManipulation: noop,
    onManipulationEnd: noop,
});

interface BoundsManagerProps {
    initialXBounds: Bounds;

    children: ReactNode | ReactNode[];
}

export function BoundsManager(props: BoundsManagerProps): ReactElement {
    const handlers = useRef<BoundsHandler[]>([]);

    const redrawPlanned = useRef(false);
    const queueCallHandlers = useCallback(() => {
        if (redrawPlanned.current) {
            return;
        }

        redrawPlanned.current = true;
        requestAnimationFrame(() => {
            redrawPlanned.current = false;
            for (const drawer of handlers.current) drawer(tmpXBounds.current ?? finalXBoundsRef.current);
        });
    }, []);

    const addXBoundsCallback = useCallback(
        (fn: BoundsHandler) => {
            handlers.current.push(fn);
            queueCallHandlers();
        },
        [queueCallHandlers]
    );
    const removeXBoundsCallback = useCallback(
        (fn: BoundsHandler) => {
            const index = handlers.current.indexOf(fn);
            if (index !== -1) {
                handlers.current.splice(index, 1);
            }
            queueCallHandlers();
        },
        [queueCallHandlers]
    );

    const [finalXBounds, setFinalXBounds] = useState<Bounds>(props.initialXBounds);
    const finalXBoundsRef = useRef(props.initialXBounds);
    const tmpXBounds = useRef<Bounds | null>(null);

    const onManipulation = useCallback(
        (bounds: Bounds) => {
            tmpXBounds.current = bounds;
            queueCallHandlers();
        },
        [queueCallHandlers]
    );
    const onManipulationEnd = useCallback(
        (bounds: Bounds) => {
            tmpXBounds.current = null;
            finalXBoundsRef.current = bounds;
            setFinalXBounds(bounds);
            queueCallHandlers();
        },
        [setFinalXBounds, queueCallHandlers]
    );

    const context = useMemo(
        () => ({
            addXBoundsCallback,
            removeXBoundsCallback,
            onManipulation,
            onManipulationEnd,
            settledXBounds: finalXBounds,
        }),
        [addXBoundsCallback, removeXBoundsCallback, onManipulation, onManipulationEnd, finalXBounds]
    );

    return <BoundsContext.Provider value={context}>{props.children}</BoundsContext.Provider>;
}

export function useBoundsContext(): BoundsContextType {
    return useContext(BoundsContext);
}
