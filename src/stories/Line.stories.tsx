import { Meta, StoryObj } from "@storybook/react";
import { BoundsManager } from "../lib";
import {
    Background,
    Canvas,
    FPSIndicator,
    FPSManager,
    Line,
    Manipulator,
    TimeXGrid,
    TimeXLegend,
    YAxisProvider,
    YGrid,
    YLegend,
} from "../lib-v1";
import { monthXBounds, randomDataForMonth, yBounds100 } from "./stories-constants";

export default {
    title: "Anagraph V1/Line",
    component: Line,
    decorators: [
        (Story) => (
            <FPSManager>
                <Story />
            </FPSManager>
        ),
    ],
} satisfies Meta<typeof Line>;

type Story = StoryObj<typeof Line>;

export const Simple: Story = {
    args: {
        color: "#3b73c4",
        lineWidth: 3,
        data: [
            [-3, 9],
            [-2, 4],
            [-1, 1],
            [0, 0],
            [1, 1],
            [2, 4],
            [3, 9],
        ],
    },

    render: (args) => (
        <BoundsManager initialXBounds={[-10, 10]}>
            <YAxisProvider bounds={[-2, 10]}>
                <FPSIndicator />
                <Canvas style={{ height: "650px", outline: "1px solid #c0c0c0" }}>
                    <Manipulator />
                    <Background />
                    <TimeXGrid />
                    <YGrid />
                    <Line {...args} />
                    <TimeXLegend />
                    <YLegend />
                </Canvas>
            </YAxisProvider>
        </BoundsManager>
    ),
};

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
        <BoundsManager initialXBounds={monthXBounds}>
            <YAxisProvider bounds={yBounds100}>
                <FPSIndicator />
                <Canvas style={{ height: "350px", outline: "1px solid #c0c0c0" }}>
                    <Manipulator boundsLimit={monthXBounds} />
                    <Background />
                    <TimeXGrid />
                    <YGrid />
                    <Line {...args} />
                    <TimeXLegend />
                    <YLegend />
                </Canvas>
            </YAxisProvider>
        </BoundsManager>
    ),
};
