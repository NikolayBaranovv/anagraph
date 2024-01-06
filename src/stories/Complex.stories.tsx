import { Meta, StoryObj } from "@storybook/react";
import { complexLinesJSON } from "./complex-data.no-prettier";
import { BottomStatus, BoundsManager, Chart, Line, VerticalFilling } from "../lib";

export default {
    title: "Anagraph V2/Complex Examples",
} satisfies Meta;

type Story = StoryObj;

const complexLinesData = JSON.parse(complexLinesJSON);

export const Z52467: Story = {
    render: () => (
        <BoundsManager initialXBounds={complexLinesData.viewport} xBoundsLimit={complexLinesData.viewport}>
            {[0, 1, 2].map((key) => (
                <Chart
                    key={key}
                    style={{ height: "450px" }}
                    settings={{
                        background: "#ffffff",
                        grid: {
                            y: { bounds: [0, 100] },
                        },
                    }}
                >
                    {complexLinesData.lines.map((data: any, i: number) => (
                        <Line key={i} color={data.color} points={data.data} lineWidth={2} yBounds={[0, 100]} />
                    ))}
                    {complexLinesData.markings.map((marking: any, i: number) => (
                        <VerticalFilling key={i} intervals={marking.data} color={marking.color} />
                    ))}
                    {complexLinesData.bottomMarkings.map((marking: any, i: number) => (
                        <BottomStatus key={i} intervals={marking.data} color={marking.color} />
                    ))}
                </Chart>
            ))}
        </BoundsManager>
    ),
};
