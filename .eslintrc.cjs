module.exports = {
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
    },
};
