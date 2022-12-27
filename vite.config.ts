import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/messaging": path.resolve(__dirname, "./src/messaging"),
            "@/domain": path.resolve(__dirname, "./src/domain"),
            "@/utils": path.resolve(__dirname, "./src/utils"),
        },
    },
    plugins: [
        eslint(),
        react({
            babel: {
                parserOpts: {
                    plugins: ["decorators-legacy", "classProperties"],
                },
            },
        }),
    ],
});
