import { useEffect } from "react";
import { noop, SafeDictionary } from "ts-essentials";

interface TouchDetails {
    originX: number;
    currentX: number;
}

function iterateTouchList(
    touchList: TouchList,
    iterator: (touch: Touch) => void
): void {
    for (let i = 0; i < touchList.length; i++) {
        iterator(touchList[i]);
    }
}

export type Bounds = Readonly<[number, number]>;

const mousePointerId = "mouse";
const wheelZoomFactor = 1.5;

/** @function useDragAndZoom
 *
 * Обработчик манипуляций горизонтального драга и зума над HTML-элементом.
 * Поддерживает таскание мышью и пальцем, двухпальцевый зум, зум колесом мыши, а также тачпадом.
 *
 * В параметр viewport передаётся отрезок, соответствующий элементу element. В коллбэки
 * будет передан отрезок, соответствующий той же области экрана, но после манипуляции.
 *
 * Важно чтобы во время манипуляции параметры этой функции не изменялись. Изменение параметров
 * приведёт к сбросу текущей манипуляции. Чтобы это обеспечить, не записывайте то, что получите
 * в onChange во viewport сразу, а используйте промежуточный стейт. При вызове onEnd полученные
 * значения уже можно записывать сразу во viewport.
 *
 * Эту особенность можно было бы обработать и внутри useDragAndZoom, чтобы не затруднять
 * вызывающего. Но весьма вероятно, что вызывающий всё равно захочет разделить коллбэки,
 * вызываемые в процессе манипуляции и в её конце, чтобы отложить какую-то работу на завершение
 * манипуляции. Скажем, если речь о графиках, лучше не пересчитывать статистику на каждое движение
 * пальцев пользователя, а сделать это когда он отпустил график. А раз так, вызывающему всё равно
 * придётся разделить временный, локальный viewport, существующий только в процессе манипуляции,
 * и финальный, устанавливаемый при её завершении. А раз так, мы не сможем облегчить задачу
 * вызывающему, спрятав временный viewport внутри этой функции, и не будем этим заниматься.
 *
 * @param element   Элемент, на котором обрабатываются события
 * @param viewport  Отрезок на некоей шкале, соответствующий элементу element
 * @param onChange  Коллбэк, который будет вызываться в процессе манипуляций
 * @param onEnd     Коллбэк, который вызовется при завершении манипуляции
 */
export function useDragAndZoom(
    element: HTMLElement | null,
    viewport: Bounds,
    onChange: (viewport: Bounds) => void,
    onEnd: (viewport: Bounds) => void
): void {
    // FIXME: возможно можно избежать лишних rebind'ов если хранить viewport
    //        в Ref'е. Он ведь нужен только в момент первого нажатия, кажется
    //        что сбрасывать весь эффект ради этого нет смысла.

    useEffect(() => {
        if (!element) return noop;

        const touchInfo: SafeDictionary<TouchDetails, number | string> = {};
        let temporaryViewport: Bounds = viewport;

        function calcXInTemporaryViewport(
            pageX: number,
            bounds: DOMRect
        ): number {
            return (
                ((pageX - bounds.left) / bounds.width) *
                    (temporaryViewport[1] - temporaryViewport[0]) +
                temporaryViewport[0]
            );
        }

        const updateTemporaryViewport = (): void => {
            const touchIds = Object.keys(touchInfo);
            const touchesCount = touchIds.length;

            if (touchesCount == 1) {
                const touch = touchInfo[touchIds[0]];

                if (touch != null) {
                    const vpDiff = touch.currentX - touch.originX;
                    temporaryViewport = [
                        temporaryViewport[0] - vpDiff,
                        temporaryViewport[1] - vpDiff,
                    ];
                }
            } else if (touchesCount == 2) {
                const touch1 = touchInfo[touchIds[0]];
                const touch2 = touchInfo[touchIds[1]];

                if (touch1 != null && touch2 != null) {
                    const [prev1, prev2, new1, new2] = [
                        Math.min(touch1.originX, touch2.originX),
                        Math.max(touch1.originX, touch2.originX),
                        Math.min(touch1.currentX, touch2.currentX),
                        Math.max(touch1.currentX, touch2.currentX),
                    ];

                    const k = (prev1 - prev2) / (new1 - new2);
                    const b = prev1 - k * new1;

                    temporaryViewport = [
                        k * temporaryViewport[0] + b,
                        k * temporaryViewport[1] + b,
                    ];
                }
            }

            onChange(temporaryViewport);
        };

        const onTouchStart = (event: TouchEvent) => {
            event.preventDefault();
            if (Object.keys(touchInfo).length == 0) {
                temporaryViewport = viewport;
            }

            const bounds = element.getBoundingClientRect();
            iterateTouchList(event.changedTouches, (touch) => {
                touchInfo[touch.identifier] = {
                    originX: calcXInTemporaryViewport(touch.pageX, bounds),
                    currentX: calcXInTemporaryViewport(touch.pageX, bounds),
                };
            });
        };

        const onTouchEnd = (event: TouchEvent) => {
            iterateTouchList(
                event.changedTouches,
                (touch) => delete touchInfo[touch.identifier]
            );

            if (Object.keys(touchInfo).length == 0) onEnd(temporaryViewport);
        };

        const onTouchMove = (event: TouchEvent) => {
            const bounds = element.getBoundingClientRect();
            iterateTouchList(event.changedTouches, (touch) => {
                const info = touchInfo[touch.identifier];
                if (info) {
                    info.currentX = calcXInTemporaryViewport(
                        touch.pageX,
                        bounds
                    );
                }
            });
            updateTemporaryViewport();
        };

        const onMouseDown = (event: MouseEvent) => {
            event.preventDefault();
            temporaryViewport = viewport;

            const bounds = element.getBoundingClientRect();
            touchInfo[mousePointerId] = {
                originX: calcXInTemporaryViewport(event.pageX, bounds),
                currentX: calcXInTemporaryViewport(event.pageX, bounds),
            };
        };

        const onMouseUp = () => {
            delete touchInfo[mousePointerId];

            if (Object.keys(touchInfo).length == 0) onEnd(temporaryViewport);
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!(mousePointerId in touchInfo)) return;

            const bounds = element.getBoundingClientRect();
            const info = touchInfo[mousePointerId];
            if (info) {
                info.currentX = calcXInTemporaryViewport(event.pageX, bounds);
                updateTemporaryViewport();
            }
        };

        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const bounds = element.getBoundingClientRect();
            const x = calcXInTemporaryViewport(event.pageX, bounds);

            const factor = Math.pow(wheelZoomFactor, event.deltaY / 53);

            temporaryViewport = [
                x - (x - temporaryViewport[0]) * factor,
                x + (temporaryViewport[1] - x) * factor,
            ];

            onEnd(temporaryViewport);
        };

        element.addEventListener("touchstart", onTouchStart);
        element.addEventListener("touchmove", onTouchMove);
        element.addEventListener("touchend", onTouchEnd);
        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("mousemove", onMouseMove);
        element.addEventListener("mouseup", onMouseUp);
        element.addEventListener("wheel", onWheel);

        return () => {
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
            element.removeEventListener("mousedown", onMouseDown);
            element.removeEventListener("mousemove", onMouseMove);
            element.removeEventListener("mouseup", onMouseUp);
            element.removeEventListener("wheel", onWheel);
        };
    }, [element, onChange, onEnd, viewport]);
}
