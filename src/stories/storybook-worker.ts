import "regenerator-runtime/runtime";
import { startAnagraphWorker } from "../lib-v1";

startAnagraphWorker();

interface AnagraphWorker extends Worker {
    new (): Worker;
}

export default {} as AnagraphWorker;
