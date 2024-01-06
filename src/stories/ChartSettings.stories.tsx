import { Meta, StoryObj } from "@storybook/react";
import { BoundsManager, Chart, ChartSettings, defaultChartSettings, Line } from "../lib";
import { DeepFlatten, flatten, unflatten } from "./flatten-utils";

type FlatChartSettings = DeepFlatten<ChartSettings>;

export default {
    title: "Anagraph V2/Chart Settings",
    parameters: { controls: { sort: "alpha" } },
} satisfies Meta<FlatChartSettings>;

type Story = StoryObj<FlatChartSettings>;

export const AllSettings: Story = {
    args: {
        ...flatten(defaultChartSettings),
        ["grid.y.bounds"]: [-1, 10],
        ["background"]: "transparent",
        ["grid.background"]: "transparent",
    },
    render: (args) => (
        <BoundsManager initialXBounds={[-10, 10]} xBoundsLimit={[-10, 10]}>
            <Chart settings={unflatten(args)}>
                <Line
                    key={1}
                    yBounds={[-1, 10]}
                    points={[
                        [-3, 9],
                        [-2, 4],
                        [-1, 1],
                        [0, 0],
                        [1, 1],
                        [2, 4],
                        [3, 9],
                    ]}
                    color="#3b73c4"
                    lineWidth={2}
                />
            </Chart>
        </BoundsManager>
    ),
};
