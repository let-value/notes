import { editor, languages } from "monaco-editor";
import { markdown } from "./language/markdown";
import { BacklinkLinkProvider } from "./widgets/backlink/BacklinkLinkProvider";

languages.registerLinkProvider("markdown", new BacklinkLinkProvider());
languages.setMonarchTokensProvider("markdown", markdown);

editor.defineTheme("wikilink", {
    base: "vs",
    inherit: true,
    colors: {},
    rules: [
        { token: "wikilink", foreground: "00C2D1" },
        { token: "date", foreground: "E39774" },
    ],
});
