import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { FC, useCallback, useEffect, useState } from "react";
import { monarchLanguage } from "./language";

const defaultValue = `

[[2022-12-26 dsfsdf]]dsfdsf

aaa

ada [[2022-12-26 dsfsdf]] sdf s

bbb

dsfds[[2022-12-26 dsfsdf]]
`;

function setupMonaco(monaco: Monaco) {
    monaco.languages.setMonarchTokensProvider("markdown", monarchLanguage);

    monaco.editor.defineTheme("backlink", {
        base: "vs",
        inherit: true,
        colors: {},
        rules: [{ token: "backlink", foreground: "0000ff" }],
    });
}

export const Document: FC = () => {
    const monaco = useMonaco();
    const [state, setState] = useState<string | undefined>(defaultValue);
    const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();

    const handleChange = useCallback((value: string | undefined) => {
        setState(value);
    }, []);

    useEffect(() => {
        const tokens = monaco?.editor.tokenize(state || "", "markdown");
        console.log(tokens);
    }, [state, editor]);

    const handleMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        setEditor(editor);

        editor.addCommand(
            monaco.KeyMod.chord(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            ),
            () => {
                console.log("save");
            },
        );

        editor.changeViewZones(({ addZone }) => {
            const marginDiv = document.createElement("div");
            marginDiv.style.backgroundColor = "lightred";

            const div = document.createElement("div");
            div.style.backgroundColor = "red";

            addZone({ afterLineNumber: 2, marginDomNode: marginDiv, domNode: div, heightInPx: 100 });

            const div2 = document.createElement("div");
            div2.style.backgroundColor = "green";
            addZone({ afterLineNumber: 2, afterColumn: 22, domNode: div2, heightInPx: 100 });
        });
    }, []);

    return (
        <Editor
            beforeMount={setupMonaco}
            onMount={handleMount}
            height="100%"
            width="100%"
            language="markdown"
            theme="backlink"
            value={state}
            onChange={handleChange}
        />
    );
};
