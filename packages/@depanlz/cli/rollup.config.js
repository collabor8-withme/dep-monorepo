import typescript from "@rollup/plugin-typescript"
import json from '@rollup/plugin-json';

export default {
    input: "bin/depanlz.ts",
    output: {
        dir: "dist",
        format: "cjs"
    },
    plugins: [
        typescript(),
        json()
    ]
}