import typescript from "@rollup/plugin-typescript"
import json from '@rollup/plugin-json';

export default {
    input: "src/index.ts",
    output: [
        {
            file: "lib/depanlz.cjs",
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