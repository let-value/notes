import { fileTokensState } from "@/atom/file";
import { CompensatedToken } from "@/editor/services/tokensService";
import { Text } from "@blueprintjs/core";
import { Item, WorkspaceId } from "models";
import { editor } from "monaco-editor";
import { FC, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRecoilValueLoadable } from "recoil";

interface DateWidgetProps {
    workspaceId: WorkspaceId;
    item: Item;
    token: CompensatedToken;
    editor: editor.IStandaloneCodeEditor;
    widget: editor.IContentWidget | undefined;
}

export const RenderDateWidget: FC<DateWidgetProps> = ({ workspaceId, item, editor, token, widget }) => {
    const target = widget?.getDomNode();

    const tokens = useRecoilValueLoadable(fileTokensState({ workspaceId, path: item?.path }));

    const mathedToke = useMemo(
        () =>
            tokens.state === "hasValue"
                ? tokens.contents?.find(
                      (t) =>
                          t.line === token.compensatedLine &&
                          t.start === token.compensatedStart &&
                          t.value === token.value,
                  )
                : undefined,
        [tokens, token],
    );

    if (!target) {
        return null;
    }

    return createPortal(<Text color={mathedToke ? "red" : undefined}>{token.value}</Text>, target);
};
