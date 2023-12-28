import { Meta, StoryObj } from "@storybook/react";
import { complexLinesJSON } from "./complex-data.no-prettier";
import {
    Background,
    Canvas,
    FPSIndicator,
    FPSManager,
    Line,
    Manipulator,
    TimeXGrid,
    TimeXLegend,
    VerticalFilling,
    YAxisProvider,
    YGrid,
    YLegend,
} from "../lib-v1";
import { BoundsManager } from "../lib";

export default {
    title: "Anagraph V1/Complex Examples",
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
        <BoundsManager initialXBounds={complexLinesData.viewport} xBoundsLimit={complexLinesData.viewport}>
            <YAxisProvider bounds={[0, 100]}>
                <FPSIndicator />
                <Canvas style={{ height: "450px", outline: "1px solid #c0c0c0" }}>
                    <Manipulator />
                    <Background />
                    <TimeXGrid />
                    <YGrid />
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
