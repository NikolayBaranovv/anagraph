import type { Preview } from "@storybook/react";
import AnagraphWorker from "../src/stories/storybook-worker";
import AnagraphChartWorker from "../src/stories/storybook-chart-worker";
import { WorkerCreatorProvider } from "../src/lib";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story, context) => {
            if (context.args._chartWorker) {
                return (
                    <WorkerCreatorProvider workerCreator={() => new AnagraphChartWorker()}>
                        {Story()}
                    </WorkerCreatorProvider>
                );
            } else {
                return (
                    <WorkerCreatorProvider workerCreator={() => new AnagraphWorker()}>{Story()}</WorkerCreatorProvider>
                );
            }
        },
    ],
};

export default preview;
