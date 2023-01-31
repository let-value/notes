import { editor, languages } from "monaco-editor";
import { markdown } from "./language/markdown";
import { schema as database } from "./schemas/database.schema";
import { LinkProvider } from "./widgets/link/LinkProvider";

languages.registerLinkProvider("markdown", new LinkProvider());
languages.setMonarchTokensProvider("markdown", markdown);
languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
        {
            uri: database.$id,
            fileMatch: [".notes/database/**/*.json"],
            schema: database,
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
