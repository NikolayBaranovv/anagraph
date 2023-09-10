import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import replace from "rollup-plugin-replace";
import html from "@rollup/plugin-html";

export default [
    {
        input: "src/index.tsx",
        output: {
            dir: "demo",
            sourcemap: true,
        },
        plugins: [
            peerDepsExternal(),
            replace({
                "process.env.NODE_ENV": '"production"',
            }),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            html({ title: "Anagraph Demo" }),
            process.env.LIVE && serve({ contentBase: "demo", open: true }),
            process.env.LIVE && livereload("demo"),
        ],
    },
    {
        input: "src/worker.ts",
        output: {
            dir: "demo",
            format: "esm",
        },
        plugins: [
            peerDepsExternal(),
            replace({
                "process.env.NODE_ENV": '"production"',
            }),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
        ],
    },
];
