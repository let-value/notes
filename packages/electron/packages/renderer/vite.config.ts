/* eslint-env node */
//import {renderer} from 'unplugin-auto-expose';
import { join } from "node:path";
import { defineConfig, UserConfig } from "vite";
import { config as baseConfig } from "../../../app/vite.config";
import { injectAppVersion } from "../../version/inject-app-version-plugin.mjs";

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, "../..");
const APP_ROOT = join(PACKAGE_ROOT, "../../../app");

const config: UserConfig = {
    ...baseConfig,
    //mode: process.env.MODE,
    root: APP_ROOT,
    envDir: APP_ROOT,
    build: {
        ...baseConfig.build,
        target: "esnext",
    },
    worker: {
        ...baseConfig.worker,
        format: "es",
    },
    // base: "",
    // server: {
    //     fs: {
    //         strict: true,
    //     },
    // },
    // build: {
    //     sourcemap: true,
    //     target: `chrome${chrome}`,
    //     outDir: "dist",
    //     assetsDir: ".",
    //     rollupOptions: {
    //         input: join(APP_ROOT, "index.html"),
    //     },
    //     emptyOutDir: true,
    //     reportCompressedSize: false,
    // },
    plugins: [
        ...baseConfig.plugins,
        // renderer.vite({
        //   preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
        // }),
        injectAppVersion(),
    ],
};

export default defineConfig(config);
