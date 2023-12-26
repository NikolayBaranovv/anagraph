import { Meta, StoryObj } from "@storybook/react";
import { Background, Canvas, Manipulator, TimeXGrid, TimeXLegend } from "../lib-v1";
import { yearXBounds } from "./stories-constants";
import { BoundsManager } from "../lib";

export default {
    title: "Anagraph V1/TimeXGrid",
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
