import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { noop } from "ts-essentials";
import { useCallbackList } from "./useCallbackList";

type FPSHandler = (fps: number) => void;

interface FPSContextType {
    addFPSHandler(callback: FPSHandler): void;

    incCounter(): void;
}

const FPSContext = createContext<FPSContextType>({
    addFPSHandler: noop,
    incCounter: noop,
});

interface FPSManagerProps {
    children: ReactNode | ReactNode[];
}

export function FPSManager(props: FPSManagerProps) {
    const { addCallback: addFPSHandler, callCallbacks } = useCallbackList<FPSHandler>();

    const counter = useRef(0);
    const incCounter = useCallback(() => {
        counter.current++;
    }, []);

    const intervalMs = 1000;

    useEffect(() => {
        const int = window.setInterval(() => {
            const fps = (counter.current / intervalMs) * 1e3;
            counter.current = 0;
            callCallbacks(fps);
        }, intervalMs);
        return () => window.clearInterval(int);
    }, [callCallbacks]);

    const context: FPSContextType = useMemo(() => ({ addFPSHandler, incCounter }), [addFPSHandler, incCounter]);

    return <FPSContext.Provider value={context}>{props.children}</FPSContext.Provider>;
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
                bottom: 0,
                width: "64px",
                padding: "5px",
            }}
        />
    );
}

export function useIncFPSCounter(): () => void {
    return useContext(FPSContext).incCounter;
}
