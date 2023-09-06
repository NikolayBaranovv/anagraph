import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import replace from "rollup-plugin-replace";
import html from "@rollup/plugin-html";

const packageJson = require("./package.json");

export default [
    // {
    //     input: "src/lib/index.ts",
    //     output: [
    //         {
    //             file: packageJson.main,
    //             format: "cjs",
    //             sourcemap: true,
    //         },
    //         {
    //             file: packageJson.module,
    //             format: "esm",
    //             sourcemap: true,
    //         },
    //     ],
    //     plugins: [peerDepsExternal(), resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" }) /*terser()*/],
    //     external: ["react", "react-dom"],
    // },
    // {
    //     input: "src/lib/index.ts",
    //     output: [{ file: "dist/anagraph.d.ts", format: "es" }],
    //     plugins: [dts.default()],
    // },

    {
        input: "src/index.tsx",
        output: {
            dir: "dist",
            sourcemap: true,
        },
        plugins: [
            peerDepsExternal(),
            replace({
                "process.env.NODE_ENV": '"production"',
            }),
            resolve(),
            commonjs(),
            html({ title: "Anagraph Demo" }),
            typescript({ tsconfig: "./tsconfig.json" }),
            process.env.LIVE && serve({ contentBase: "dist", open: true }),
            process.env.LIVE && livereload("dist"),
        ],
    },
];
