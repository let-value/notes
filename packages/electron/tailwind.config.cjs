// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../app/tailwind.config.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
    ...config,
    content: [
        "./packages/renderer/index.html",
        "./packages/renderer/src/**/*.{js,ts,jsx,tsx}",
        "../app/src/**/*.{js,ts,jsx,tsx}",
    ],
};
