import type { Preview } from "@storybook/react";
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
        (Story, context) => (
            <WorkerCreatorProvider workerCreator={() => new AnagraphChartWorker()}>{Story()}</WorkerCreatorProvider>
        ),
    ],
};

export default preview;
