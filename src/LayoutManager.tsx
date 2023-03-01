import { createContext, ReactElement, ReactNode, useContext, useEffect, useMemo } from "react";
import { Rect, Size } from "./utils";
import { CanvasContext } from "./Canvas";

interface Layout {
    bottomLabelsHeight: number;
    leftLabelsWidth: number;
}

const defaultLayout = {
    bottomLabelsHeight: 24,
    leftLabelsWidth: 32,
};
export const LayoutContext = createContext<Layout>(defaultLayout);

interface LayoutManagerProps extends Partial<Layout> {
    children: ReactNode | ReactNode[];
}
export function LayoutManager(props: LayoutManagerProps): ReactElement {
    const value = useMemo(() => ({ ...defaultLayout, ...props }), [props]);
    return <LayoutContext.Provider value={value}>{props.children}</LayoutContext.Provider>;
}

export function useGridRect(): Rect {
    const layout = useContext(LayoutContext);
    const { size: canvasSize } = useContext(CanvasContext);

    return useMemo(
        () => ({
            x: layout.leftLabelsWidth,
            y: 0,
            width: canvasSize.width - layout.leftLabelsWidth,
            height: canvasSize.height - layout.bottomLabelsHeight,
        }),
        [layout, canvasSize]
    );
}
