import { createContext, useContext, useMemo } from "react";

interface WorkerUrlContextType {
    workerUrl: string;
}

const WorkerUrlContext = createContext<WorkerUrlContextType>({
    workerUrl: "WORKER_URL_NOT_SPECIFIED",
});

interface WorkerUrlProviderProps {
    workerUrl: string;
    children: React.ReactNode | React.ReactNode[];
}

export function WorkerUrlProvider(props: WorkerUrlProviderProps) {
    const value = useMemo(() => ({ workerUrl: props.workerUrl }), [props.workerUrl]);
    return <WorkerUrlContext.Provider value={value}>{props.children}</WorkerUrlContext.Provider>;
}

export function useWorkerUrl(): string {
    return useContext(WorkerUrlContext).workerUrl;
}
