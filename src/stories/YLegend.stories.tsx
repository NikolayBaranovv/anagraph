import { Meta, StoryObj } from "@storybook/react";
import { Background, BoundsManager, Canvas, Manipulator, TimeXGrid, YAxisProvider, YGrid, YLegend } from "../lib";
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
