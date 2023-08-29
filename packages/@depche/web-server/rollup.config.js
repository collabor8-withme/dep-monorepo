import typescript from "@rollup/plugin-typescript";
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
        typescript()
    ]
}