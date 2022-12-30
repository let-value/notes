import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { customMonarchMarkdownLanguage } from "./components/Document/customMonarchMarkdownLanguage";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_: never, label: string) {
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
