// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../app/tailwind.config.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = { ...config, content: [...config.content, "./packages/renderer/index.html"] };
