import { fitBoundsInLimit } from "./useDragAndZoom";

import { Bounds } from "./basic-types";

describe("fitBoundsInLimit", () => {
    it("returns incoming bounds if the limit is null", () => {
        const bounds: Bounds = [1, 2];
        expect(fitBoundsInLimit(bounds, undefined)).toBe(bounds);
    });

    it("returns empty [limit_min, limit_min] if both sides of bounds is less than limit", () => {
        expect(fitBoundsInLimit([1, 2], [3, 4])).toEqual([3, 4]);
    });

    it("returns empty [limit_min, limit_max] if both sides of bounds is greater than limit", () => {
        expect(fitBoundsInLimit([5, 6], [3, 4])).toEqual([3, 4]);
    });

    it("clips partly covered bounds on the left", () => {
        expect(fitBoundsInLimit([1, 3], [2, 4])).toEqual([2, 4]);
    });

    it("clips partly covered bounds on the right", () => {
        expect(fitBoundsInLimit([5, 7], [4, 6])).toEqual([4, 6]);
    });

    it("clips partly covered bounds on both edges", () => {
        expect(fitBoundsInLimit([1, 5], [3, 4])).toEqual([3, 4]);
    });

    it("returns bounds if it completely inside the limits", () => {
        const bounds: Bounds = [2, 3];
        expect(fitBoundsInLimit(bounds, [1, 4])).toBe(bounds);
    });

    it("returns bounds if it is equal to the limits", () => {
        const bounds: Bounds = [2, 3];
        expect(fitBoundsInLimit(bounds, [2, 3])).toBe(bounds);
    });
});

describe("fitBoundsInLimits", () => {});
