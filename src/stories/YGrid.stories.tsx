import { Meta, StoryObj } from "@storybook/react";
import { Background, BoundsManager, Canvas, Manipulator, YAxisProvider, YGrid, YLegend } from "../lib";
import { yBounds100, yearXBounds } from "./stories-constants";

export default {
    title: "Anagraph/YGrid",
    component: YGrid,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas>
                        <Manipulator />
                        <Background />
                        <Story />
                        <YLegend />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof YGrid>;

type Story = StoryObj<typeof YGrid>;

export const Simple: Story = {
    args: {
        color: "#ccc",
        lineWidth: 1,
    },
};
