import { Background, Canvas, Manipulator, TimeXGrid, TimeXLegend, IntervalChart, LayoutManager } from "../lib-v1";
import { Meta, StoryObj } from "@storybook/react";
import { ts } from "./utils";
import { BoundsManager } from "../lib";

export default {
    title: "Anagraph V1/IntervalChart",
    component: IntervalChart,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={[ts(2022, 11, 31, 12), ts(2023, 0, 6, 12)]}>
                <LayoutManager>
                    <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0" }}>
                        <Manipulator />
                        <Background />
                        <TimeXGrid />
                        <Story />
                        <TimeXLegend />
                    </Canvas>
                </LayoutManager>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof IntervalChart>;

type Story = StoryObj<typeof IntervalChart>;

export const Simple = {
    args: {
        intervals: [
            [ts(2023, 0, 1), ts(2023, 0, 2)],
            [ts(2023, 0, 3), ts(2023, 0, 4)],
            [ts(2023, 0, 5), ts(2023, 0, 6)],
        ],
        color: "#c4443b80",
    },
} satisfies Story;

export const Overlapping: Story = {
    args: {
        intervals: [
            [ts(2023, 0, 1, 12), ts(2023, 0, 2, 12)],
            [ts(2023, 0, 3, 12), ts(2023, 0, 4, 12)],
            [ts(2023, 0, 5, 12), ts(2023, 0, 6, 12)],
        ],
        color: "rgba(26,108,208,0.5)",
    },

    render: (args) => (
        <>
            <IntervalChart {...Simple.args} />
            <IntervalChart {...args} />
        </>
    ),
};
