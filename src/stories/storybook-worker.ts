import "regenerator-runtime/runtime";
import { startAnagraphWorker } from "../lib";

startAnagraphWorker();

interface AnagraphWorker extends Worker {
    new (): Worker;
}

export default {} as AnagraphWorker;
