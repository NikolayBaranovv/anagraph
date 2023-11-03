import { Meta, StoryObj } from "@storybook/react";
import { Background, BoundsManager, Canvas, Manipulator, TimeXGrid, TimeXLegend } from "../lib";
import { yearXBounds } from "./stories-constants";

export default {
    title: "Anagraph/TimeXGrid",
    component: TimeXGrid,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <Canvas>
                    <Manipulator />
                    <Background />
                    <Story />
                    <TimeXLegend />
                </Canvas>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof TimeXGrid>;

type Story = StoryObj<typeof TimeXGrid>;

export const Simple: Story = {
    args: {
        color: "#ccc",
        lineWidth: 1,
    },
};
