import { databaseSchema, viewSchema } from "models";
import { editor, languages } from "monaco-editor";
import { markdown } from "./language/markdown";
import { LinkProvider } from "./widgets/link/LinkProvider";

languages.registerLinkProvider("markdown", new LinkProvider());
languages.setMonarchTokensProvider("markdown", markdown);
languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
        {
            uri: viewSchema.$id,
            fileMatch: [".notes/note/**/*database.json"],
            schema: viewSchema,
        },
        {
            uri: databaseSchema.$id,
            fileMatch: [".notes/database/**/*.json"],
            schema: databaseSchema,
        },
    ],
});

editor.defineTheme("wikilink", {
    base: "vs",
    inherit: true,
    colors: {},
    rules: [
        { token: "wikilink", foreground: "00C2D1" },
        { token: "date", foreground: "E39774" },
    ],
});
