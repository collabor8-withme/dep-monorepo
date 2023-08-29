import typescript from "@rollup/plugin-typescript"
import json from '@rollup/plugin-json';

export default {
    input: "index.ts",
    output: [
        {
            file: "dist/depanlz.cjs",
            format: "cjs"
        }
    ],
    plugins: [
        typescript(),
        json()
    ],
    external: [
        "@depche/core"
    ]
}