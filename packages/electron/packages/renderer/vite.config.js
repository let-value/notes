/* eslint-env node */
//import {renderer} from 'unplugin-auto-expose';
import { join } from "node:path";
import { defineConfig } from "vite";
//import { config as baseConfig } from "app/vite.config";
import renderer from "vite-plugin-electron-renderer";
import { config as baseConfig } from "../../../app/vite.config";
import { injectAppVersion } from "../../version/inject-app-version-plugin.mjs";

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, "../..");

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
    ...baseConfig,
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: PROJECT_ROOT,
    server: {
        hmr: false,
    },
    worker: {
        ...baseConfig.worker,
        format: "es",
    },
    plugins: [
        ...baseConfig.plugins,
        renderer({
            nodeIntegration: true,
        }),
        injectAppVersion(),
    ],
};

export default defineConfig(config);
