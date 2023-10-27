import { Meta, StoryObj } from "@storybook/react";
import { Background, BoundsManager, Canvas, Grid, Manipulator, TimeXLegend, YAxisProvider, YLegend } from "../lib";
import { yBounds100, yearXBounds } from "./stories-constants";

export default {
    title: "Anagraph/Grid",
    component: Grid,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas>
                        <Manipulator />
                        <Background />
                        <Story />
                        <TimeXLegend />
                        <YLegend />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof Grid>;

type Story = StoryObj<typeof Grid>;

export const TimeGrid: Story = {
    args: {
        color: "#ccc",
        lineWidth: 1,
    },
};
