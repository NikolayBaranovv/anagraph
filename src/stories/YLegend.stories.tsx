import { Meta, StoryObj } from "@storybook/react";
import { Background, Canvas, Manipulator, TimeXGrid, YAxisProvider, YGrid, YLegend } from "../lib-v1";
import { yBounds100, yearXBounds } from "./stories-constants";
import { BoundsManager } from "../lib";

export default {
    title: "Anagraph V1/YLegend",
    component: YLegend,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas>
                        <Manipulator />
                        <Background />
                        <YGrid />
                        <TimeXGrid />
                        <Story />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof YLegend>;

type Story = StoryObj<typeof YLegend>;

export const YLegendStory: Story = {};
