module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
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
        // Add your own rules here to override ones from the extended configs.
    },
};
