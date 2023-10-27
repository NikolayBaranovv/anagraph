import type { Preview } from "@storybook/react";
import AnagraphWorker from "../src/stories/storybook-worker";
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
        (Story) => <WorkerCreatorProvider workerCreator={() => new AnagraphWorker()}>{Story()}</WorkerCreatorProvider>,
    ],
};

export default preview;
