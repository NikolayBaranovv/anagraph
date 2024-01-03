import { Meta, StoryObj } from "@storybook/react";
import { BoundsManager, Chart, VerticalFilling } from "../lib";
import { ts } from "./utils";

export default {
    title: "Anagraph V2/VerticalFilling",
    component: VerticalFilling,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={[ts(2022, 11, 31, 12), ts(2023, 0, 6, 12)]}>
                <Chart>
                    <Story />
                </Chart>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof VerticalFilling>;

type Story = StoryObj<typeof VerticalFilling>;

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
            <VerticalFilling {...Simple.args} />
            <VerticalFilling {...args} />
        </>
    ),
};
