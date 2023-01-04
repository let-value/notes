import { DateWidget } from "@/editor/widgets";
import { Token } from "models";
import { editor } from "monaco-editor";
import { FC, useEffect, useState } from "react";
import { RenderDateWidget } from "./RenderDateWidget";

interface DateLineWidgetsProps {
    editor: editor.IStandaloneCodeEditor;
    tokens: Token[];
}

export const DateLineWidgets: FC<DateLineWidgetsProps> = ({ editor, tokens }) => {
    const [widget] = useState(() => new DateWidget(editor, tokens));

    useEffect(() => {
        widget.updateTokens(editor, tokens);
    }, [editor, tokens, widget]);

    useEffect(() => {
        return () => {
            widget?.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {tokens.map((token, index) => (
                <RenderDateWidget key={index} token={token} widget={widget?.getContentWidget(index)} />
            ))}
        </>
    );
};
