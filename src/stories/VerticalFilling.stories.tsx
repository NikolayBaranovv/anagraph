import { Meta, StoryObj } from "@storybook/react";
import { VerticalFilling } from "../lib/VerticalFilling";
import { Background, BoundsManager, Canvas, Grid, Manipulator, TimeXLegend, YAxisProvider, YLegend } from "../lib";

export default {
    title: "Anagraph/VerticalFilling",
    component: VerticalFilling,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={[ts(2022, 11, 31, 12), ts(2023, 0, 6, 12)]}>
                <YAxisProvider bounds={[0, 100]}>
                    <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0" }}>
                        <Manipulator />
                        <Background />
                        <Grid />
                        <Story />
                        <TimeXLegend />
                        <YLegend />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof VerticalFilling>;

type Story = StoryObj<typeof VerticalFilling>;

function ts(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0) {
    return new Date(year, month, day, hour, minute, second).getTime();
}

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
