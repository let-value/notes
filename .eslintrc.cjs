module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended",
        "eslint-config-prettier",
    ],
    settings: {
        react: {
            version: "18.0",
        },
    },
    rules: {
        "typescript-eslint/ban-ts-comment": "off",
        "react-hooks/exhaustive-deps": [
            "warn",
            {
                additionalHooks: "(useRecoilCallback|useAsyncMemo|useDrop|useDrag)",
            },
        ],
    },
};
