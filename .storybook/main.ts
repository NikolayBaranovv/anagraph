import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    async webpackFinal(config) {
        const newConfig = {
            ...config,
            module: {
                ...config.module,
                rules: [
                    {
                        test: /storybook-(chart-)?worker\.ts$/,
                        use: ["worker-loader"],
                    },
                    ...(config.module?.rules ?? []),
                ],
            },
        };
        return newConfig;
    },
};
export default config;
