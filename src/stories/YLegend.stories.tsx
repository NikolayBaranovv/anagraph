import { Meta, StoryObj } from "@storybook/react";
import {
    Background,
    Bounds,
    BoundsManager,
    Canvas,
    Grid,
    Manipulator,
    WorkerCreatorProvider,
    YAxisProvider,
    YLegend,
} from "../lib";
import AnagraphWorker from "./storybook-worker";
import { yBounds100, yearXBounds } from "./stories-constants";

export default {
    title: "Anagraph/YLegend",
    component: YLegend,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas>
                        <Manipulator />
                        <Background />
                        <Grid />
                        <Story />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof YLegend>;

type Story = StoryObj<typeof YLegend>;

export const YLegendStory: Story = {};
