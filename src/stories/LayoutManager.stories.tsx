import { Meta, StoryObj } from "@storybook/react";
import {
    Background,
    BoundsManager,
    Canvas,
    Grid,
    LayoutManager,
    Line,
    Manipulator,
    TimeXLegend,
    YAxisProvider,
    YLegend,
} from "../lib";
import { monthXBounds, randomDataForMonth, yBounds100 } from "./stories-constants";

export default {
    title: "Anagraph/LayoutManager",
    component: LayoutManager,
} satisfies Meta<typeof LayoutManager>;

type Story = StoryObj<typeof LayoutManager>;

export const LayoutManagerStory: Story = {
    args: {
        bottomLabelsHeight: 48,
        leftLabelsWidth: 64,
        topGap: 10,
        labelsSettings: {
            textColor: "#990099",
            bulletRadius: 6,
            fontFamily: "sans-serif",
            fontStyle: "italic",
            fontSize: 19,
            xLabelsGap: 6,
            yLabelsGap: 16,
            yLabelsHeight: 48,
        },
    },
    render: (args) => (
        <LayoutManager {...args}>
            <BoundsManager initialXBounds={monthXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas style={{ outline: "1px solid gray" }}>
                        <Manipulator />
                        <Background />
                        <Grid />
                        <Line color="#c4443b" lineWidth={2} data={randomDataForMonth} />
                        <TimeXLegend />
                        <YLegend />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        </LayoutManager>
    ),
};
