import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { noop } from "ts-essentials";
import { useCallbackList } from "./useCallbackList";

type FPSHandler = (fps: number) => void;
type SetCounter = (fps: number) => void;

interface FPSContextType {
    addFPSHandler(callback: FPSHandler): void;

    setCounter: SetCounter;
}

const FPSContext = createContext<FPSContextType>({
    addFPSHandler: noop,
    setCounter: noop,
});

interface FPSManagerProps {
    children: ReactNode | ReactNode[];
}

export function FPSManager(props: FPSManagerProps) {
    const { addCallback: addFPSHandler, callCallbacks } = useCallbackList<FPSHandler>();

    const maxCounter = useRef(0);
    const setCounter = useCallback((fps: number) => {
        if (fps > maxCounter.current) {
            maxCounter.current = fps;
        }
    }, []);

    const intervalMs = 1000;

    useEffect(() => {
        const int = window.setInterval(() => {
            const fps = (maxCounter.current / intervalMs) * 1e3;
            maxCounter.current = 0;
            callCallbacks(fps);
        }, intervalMs);
        return () => window.clearInterval(int);
    }, [callCallbacks]);

    const context: FPSContextType = useMemo(() => ({ addFPSHandler, setCounter }), [addFPSHandler, setCounter]);

    return <FPSContext.Provider value={context}>{props.children}</FPSContext.Provider>;
}

export function FPSIndicator() {
    const fpsContext = useContext(FPSContext);
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fpsContext?.addFPSHandler((fps) => {
            if (div.current) {
                div.current.innerText = `FPS: ${fps.toFixed(1)}`;
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
                width: "128px",
                padding: "5px",
                color: "#fff",
                background: "rgba(0, 0, 0, 0.6)",
                zIndex: 9999,
            }}
        />
    );
}

export function useSetFPSCounter(): SetCounter {
    return useContext(FPSContext).setCounter;
}
