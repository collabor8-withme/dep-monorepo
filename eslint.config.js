import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugins from '@typescript-eslint/eslint-plugin'
export default [
    {
        files: [
            "packages/**/*.ts"
        ],
        ignores: [
            "packages/**/*.d.ts"
        ],
        languageOptions: {
            parser: typescriptParser
        },
        plugins: {
            "@typescript-eslint": typescriptPlugins
        },
        rules: {
            "@typescript-eslint/no-dupe-class-members": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-use-before-define": "error",
            "@typescript-eslint/no-confusing-void-expression": "error"
        }
    }
];
