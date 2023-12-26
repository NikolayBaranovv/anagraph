import { Meta, StoryObj } from "@storybook/react";
import { Background, Canvas, Manipulator, TimeXGrid, TimeXLegend, YAxisProvider } from "../lib-v1";
import { yBounds100, yearXBounds } from "./stories-constants";
import { BoundsManager } from "../lib";

export default {
    title: "Anagraph V1/TimeXLegend",
    component: TimeXLegend,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas>
                        <Manipulator />
                        <Background />
                        <TimeXGrid />
                        <Story />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof TimeXLegend>;

type Story = StoryObj<typeof TimeXLegend>;

export const TimeXLegendStory: Story = {};
