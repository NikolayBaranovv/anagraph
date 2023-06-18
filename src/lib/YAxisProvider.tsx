import { createContext, ReactElement, ReactNode, useContext, useMemo } from "react";
import { Bounds } from "./useDragAndZoom";

interface YAxisContextType {
    bounds: Bounds;
}

const YAxisContext = createContext<YAxisContextType>({
    bounds: [0, 1],
});

interface YAxisProviderProps {
    bounds: Bounds;

    children: ReactNode | ReactNode[];
}

export function YAxisProvider(props: YAxisProviderProps): ReactElement {
    const context = useMemo(
        () => ({
            bounds: props.bounds,
        }),
        [props.bounds[0], props.bounds[1]]
    );

    return <YAxisContext.Provider value={context}>{props.children}</YAxisContext.Provider>;
}

export function useYAxisContext(): YAxisContextType {
    return useContext(YAxisContext);
}
