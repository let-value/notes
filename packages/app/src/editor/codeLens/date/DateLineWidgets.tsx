import { CompensatedToken } from "@/editor/services/tokensService";
import { DateWidget } from "@/editor/widgets";
import { Item, WorkspaceId } from "models";
import { editor } from "monaco-editor";
import { FC, useEffect, useState } from "react";
import { RenderDateWidget } from "./RenderDateWidget";

interface DateLineWidgetsProps {
    workspaceId: WorkspaceId;
    item: Item;
    editor: editor.IStandaloneCodeEditor;
    tokens: CompensatedToken[];
}

export const DateLineWidgets: FC<DateLineWidgetsProps> = ({ workspaceId, item, editor, tokens }) => {
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
                <RenderDateWidget
                    key={index}
                    token={token}
                    workspaceId={workspaceId}
                    item={item}
                    editor={editor}
                    widget={widget?.getContentWidget(index)}
                />
            ))}
        </>
    );
};
