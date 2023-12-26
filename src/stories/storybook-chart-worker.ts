import "regenerator-runtime/runtime";
import { startChartWorker } from "../lib";

startChartWorker();

interface AnagraphChartWorker extends Worker {
    new (): Worker;
}

export default {} as AnagraphChartWorker;
