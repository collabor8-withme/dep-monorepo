import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve"
export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/bundler.esm.js",
            format: "esm"
        },
        {
            file: "dist/bundler.cjs",
            format: "cjs"
        }
    ],
    plugins: [
        resolve(),
        typescript()
    ]
}