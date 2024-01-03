import "regenerator-runtime/runtime";
import { startWorker } from "../lib";

startWorker();

interface AnagraphChartWorker extends Worker {
    new (): Worker;
}

export default {} as AnagraphChartWorker;
