import { Meta, StoryObj } from "@storybook/react";
import { Background, BoundsManager, Canvas, Grid, Manipulator, TimeXLegend, YAxisProvider } from "../lib";
import { yBounds100, yearXBounds } from "./stories-constants";

export default {
    title: "Anagraph/TimeXLegend",
    component: TimeXLegend,
    decorators: [
        (Story) => (
            <BoundsManager initialXBounds={yearXBounds}>
                <YAxisProvider bounds={yBounds100}>
                    <Canvas>
                        <Manipulator />
                        <Background />
                        <Grid />
                        <Story />
                    </Canvas>
                </YAxisProvider>
            </BoundsManager>
        ),
    ],
} satisfies Meta<typeof TimeXLegend>;

type Story = StoryObj<typeof TimeXLegend>;

export const TimeXLegendStory: Story = {};
