import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { noop } from "ts-essentials";

type FPSHandler = (fps: number) => void;

interface FPSContextType {
    addFPSHandler(callback: FPSHandler): void;

    incCounter(): void;
}

export const FPSContext = createContext<FPSContextType>({
    addFPSHandler: noop,
    incCounter: noop,
});

interface FPSManagerProps {
    children: ReactNode | ReactNode[];
}

export function FPSManager(props: FPSManagerProps) {
    const handlers = useRef<FPSHandler[]>([]);

    const addFPSHandler = useCallback(
        (callback: FPSHandler) => handlers.current.push(callback),
        []
    );

    const counter = useRef(0);

    const incCounter = useCallback(() => {
        counter.current++;
    }, []);

    const intervalMs = 1000;

    useEffect(() => {
        const int = window.setInterval(() => {
            const fps = (counter.current / intervalMs) * 1e3;
            counter.current = 0;

            for (const handler of handlers.current) {
                handler(fps);
            }
        }, intervalMs);
        return () => window.clearInterval(int);
    }, []);

    const context = useMemo(
        () => ({ addFPSHandler, incCounter }),
        [addFPSHandler, incCounter]
    );

    return (
        <FPSContext.Provider value={context}>
            {props.children}
        </FPSContext.Provider>
    );
}

export function FPSIndicator() {
    const fpsContext = useContext(FPSContext);
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fpsContext?.addFPSHandler((fps) => {
            if (div.current) {
                div.current.innerText = fps.toString();
            }
        });
    });

    return (
        <div
            ref={div}
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "32px",
                height: "32px",
            }}
        />
    );
}
