import { Meta, StoryObj } from "@storybook/react";
import { Background, Canvas } from "../lib";

const meta = {
    title: "Anagraph/Background",
    component: Background,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof Background>;

export const Color: Story = {
    args: {
        color: "#ff0000",
    },
};
