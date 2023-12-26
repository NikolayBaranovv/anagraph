import { Meta, StoryObj } from "@storybook/react";
import { Background, Canvas, Manipulator, YAxisProvider, YGrid, YLegend } from "../lib-v1";
import { yBounds100, yearXBounds } from "./stories-constants";
import { BoundsManager } from "../lib";

export default {
    title: "Anagraph V1/YGrid",
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
