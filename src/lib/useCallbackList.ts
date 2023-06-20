import { useCallback, useRef } from "react";

interface CallbackList<T extends (...args: any[]) => void> {
    addCallback(callback: T): void;
    removeCallback(callback: T): void;
    getCallbacks(): T[];
    callCallbacks(...args: Parameters<T>): void;
}

export function useCallbackList<T extends (...args: any[]) => void>(onChange?: () => void): CallbackList<T> {
    const callbacks = useRef<T[]>([]);

    const getCallbacks = useCallback(() => {
        return callbacks.current;
    }, []);

    const callCallbacks = useCallback((...args: Parameters<T>) => {
        for (const fn of callbacks.current) {
            fn(...args);
        }
    }, []);

    const addCallback = useCallback(
        (fn: T) => {
            callbacks.current.push(fn);
            onChange?.();
        },
        [onChange]
    );
    const removeCallback = useCallback(
        (fn: T) => {
            const index = callbacks.current.indexOf(fn);
            if (index !== -1) {
                callbacks.current.splice(index, 1);
            }
            onChange?.();
        },
        [onChange]
    );

    return {
        addCallback,
        removeCallback,
        getCallbacks,
        callCallbacks,
    };
}
