import { Meta, StoryObj } from "@storybook/react";
import { complexLinesJSON } from "./complex-data.no-prettier";
import {
    Background,
    BoundsManager,
    Canvas,
    FPSIndicator,
    FPSManager,
    Grid,
    Line,
    Manipulator,
    TimeXLegend,
    YAxisProvider,
    YLegend,
} from "../lib";
import { VerticalFilling } from "../lib/VerticalFilling";

export default {
    title: "Anagraph/Complex Examples",
    decorators: [
        (Story) => (
            <FPSManager>
                <Story />
            </FPSManager>
        ),
    ],
} satisfies Meta;

type Story = StoryObj;

const complexLinesData = JSON.parse(complexLinesJSON);

export const Z52467: Story = {
    render: (args) => (
        <BoundsManager initialXBounds={complexLinesData.viewport}>
            <YAxisProvider bounds={[0, 100]}>
                <FPSIndicator />
                <Canvas style={{ height: "450px", outline: "1px solid #c0c0c0" }}>
                    <Manipulator boundsLimit={complexLinesData.viewport} />
                    <Background />
                    <Grid />
                   {complexLinesData.markings.map((marking: any, i: number) => (
                        <VerticalFilling key={i} intervals={marking.data} color={marking.color} />
                    ))}
                    {complexLinesData.lines.map((data: any, i: number) => (
                        <Line key={i} color={data.color} data={data.data} lineWidth={2} />
                    ))}
                    <TimeXLegend />
                    <YLegend />
                </Canvas>
            </YAxisProvider>
        </BoundsManager>
    ),
};
