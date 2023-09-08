import { useCallback, useRef } from "react";
import { useLatest } from "react-use";

interface CallbackList<T extends (...args: any[]) => any> {
    addCallback(callback: T): void;
    removeCallback(callback: T): void;
    getCallbacks(): T[];
    callCallbacks(...args: Parameters<T>): ReturnType<T>[];
}

export function useCallbackList<T extends (...args: any[]) => any>(onChange?: () => void): CallbackList<T> {
    const callbacks = useRef<T[]>([]);
    const onChangeRef = useLatest(onChange);

    const getCallbacks = useCallback(() => callbacks.current, []);

    const callCallbacks = useCallback(function () {
        const results: ReturnType<T>[] = [];
        for (let i = 0, len = callbacks.current.length; i < len; i++) {
            // @ts-ignore
            results.push(callbacks.current[i].apply(null, arguments));
        }
        return results;
    }, []);

    const addCallback = useCallback((fn: T) => {
        callbacks.current.push(fn);
        onChangeRef.current?.();
    }, []);
    const removeCallback = useCallback((fn: T) => {
        const index = callbacks.current.indexOf(fn);
        if (index !== -1) {
            callbacks.current.splice(index, 1);
        }
        onChangeRef.current?.();
    }, []);

    return {
        addCallback,
        removeCallback,
        getCallbacks,
        callCallbacks,
    };
}
