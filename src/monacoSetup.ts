import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { customMonarchMarkdownLanguage } from "./components/Document/customMonarchMarkdownLanguage";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_: never, label: string) {
        if (label === "json") {
            return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
            return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return new htmlWorker();
        }
        if (label === "typescript" || label === "javascript") {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

loader.config({ monaco });

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.setMonarchTokensProvider("markdown", customMonarchMarkdownLanguage);

monaco.editor.defineTheme("backlink", {
    base: "vs",
    inherit: true,
    colors: {},
    rules: [
        { token: "backlink", foreground: "00C2D1" },
        { token: "date", foreground: "E39774" },
    ],
});
