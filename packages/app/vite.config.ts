import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, UserConfig } from "vite";
import eslint from "vite-plugin-eslint";

export const config: UserConfig = {
    resolve: {
        alias: {
            path: "path-browserify",
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
};

export default defineConfig(config);
