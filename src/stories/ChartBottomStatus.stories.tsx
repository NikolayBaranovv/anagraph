import { BottomStatus } from "../lib/BottomStatus";
import { BoundsManager, Chart } from "../lib";
import { ts } from "./utils";
import { Meta, StoryObj } from "@storybook/react";

export default {
    title: "Anagraph V2/BottomStatus",
    component: BottomStatus,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={[ts(2022, 11, 31, 12), ts(2023, 0, 6, 12)]}>
                <Chart>
                    <Story />
                </Chart>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof BottomStatus>;

type Story = StoryObj<typeof BottomStatus>;

export const Simple = {
    args: {
        // @ts-ignore
        _chartWorker: true,

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
        // @ts-ignore
        _chartWorker: true,

        intervals: [
            [ts(2023, 0, 1, 12), ts(2023, 0, 2, 12)],
            [ts(2023, 0, 3, 12), ts(2023, 0, 4, 12)],
            [ts(2023, 0, 5, 12), ts(2023, 0, 6, 12)],
        ],
        color: "rgba(26,108,208,0.5)",
    },

    render: (args) => (
        <>
            <BottomStatus {...Simple.args} />
            <BottomStatus {...args} />
        </>
    ),
};
