import { Meta, StoryObj } from "@storybook/react";
import {
    Background,
    BoundsManager,
    Canvas,
    FPSIndicator,
    FPSManager,
    Grid,
    LayoutManager,
    Line,
    Manipulator,
    TimeXLegend,
    YAxisProvider,
    YLegend,
} from "../lib";
import { generateRandomData } from "../lib/utils";
import { monthXBounds, randomDataForMonth, yBounds100 } from "./stories-constants";

export default {
    title: "Anagraph/Line",
    component: Line,
} satisfies Meta<typeof Line>;

type Story = StoryObj<typeof Line>;

export const MonthOfData: Story = {
    args: {
        color: "#c4443b",
        lineWidth: 2,
        data: randomDataForMonth,
    },
    argTypes: {
        data: {
            table: {
                disable: true,
            },
        },
    },

    render: (args) => (
        <FPSManager>
            <LayoutManager>
                <BoundsManager initialXBounds={monthXBounds}>
                    <YAxisProvider bounds={yBounds100}>
                        <FPSIndicator />
                        <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0" }}>
                            <Manipulator boundsLimit={monthXBounds} />
                            <Background />
                            <Grid />
                            <Line {...args} />
                            <TimeXLegend />
                            <YLegend />
                        </Canvas>
                    </YAxisProvider>
                </BoundsManager>
            </LayoutManager>
        </FPSManager>
    ),
};
