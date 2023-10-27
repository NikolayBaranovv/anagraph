import { Bounds } from "../lib";
import { generateRandomData } from "../lib/utils";

export const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

export const yearXBounds: Bounds = [new Date(2023, 0, 1).getTime(), new Date(2023, 11, 31).getTime()];
export const yBounds100: Bounds = [-100, 100];

export const monthXBounds: Bounds = [todayStart.getTime(), todayStart.getTime() + 31 * 24 * 60 * 60 * 1e3];

export const randomDataForMonth = generateRandomData(monthXBounds, yBounds100, 31 * 24 * 60, 0);
