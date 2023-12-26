import { Meta, StoryObj } from "@storybook/react";
import { complexLinesJSON } from "./complex-data.no-prettier";
import { BoundsManager, Chart, Line, VerticalFilling } from "../lib";

export default {
    title: "Anagraph/Complex Examples",
} satisfies Meta;

type Story = StoryObj;

const complexLinesData = JSON.parse(complexLinesJSON);

export const Z52467: Story = {
    args: {
        _chartWorker: true,
    },
    render: () => (
        <BoundsManager initialXBounds={complexLinesData.viewport}>
            <Chart
                style={{ height: "450px" }}
                settings={{
                    background: "#ffffff",
                    grid: {
                        y: { bounds: [0, 100] },
                    },
                }}
            >
                {complexLinesData.markings.map((marking: any, i: number) => (
                    <VerticalFilling key={i} intervals={marking.data} color={marking.color} />
                ))}
                {complexLinesData.lines.map((data: any, i: number) => (
                    <Line key={i} color={data.color} points={data.data} lineWidth={2} yBounds={[0, 100]} />
                ))}
            </Chart>
        </BoundsManager>
    ),
};
