import { Text } from "evergreen-ui";
import { Token } from "models";
import { editor } from "monaco-editor";
import { FC } from "react";
import { createPortal } from "react-dom";

interface DateWidgetProps {
    token: Token;
    widget: editor.IContentWidget | undefined;
}

export const RenderDateWidget: FC<DateWidgetProps> = ({ token, widget }) => {
    const target = widget?.getDomNode();

    if (!target) {
        return null;
    }

    return createPortal(<Text whiteSpace="nowrap">{token.value}</Text>, target);
};
