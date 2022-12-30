import { Token } from "@/domain";
import { DateWidget } from "@/editor/widgets";
import { useWhyDidYouUpdate } from "@/utils/useWhyDidYouUpdate";
import { Text } from "evergreen-ui";
import { groupBy, isEqual } from "lodash-es";
import { editor } from "monaco-editor";
import { FC, RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { filter, map, mergeMap, Observable } from "rxjs";
import { getModelTokensSubject } from "./tokensRepository";

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

interface DateLineWidgetsProps {
    editor: RefObject<editor.IStandaloneCodeEditor>;
    tokens: Token[];
}

const DateLineWidgets: FC<DateLineWidgetsProps> = ({ editor, tokens }) => {
    const [widget] = useState(() => new DateWidget(editor.current, tokens));

    useWhyDidYouUpdate("DateLineWidgets", { editor, tokens, widget });

    useEffect(() => {
        widget.updateTokens(editor.current, tokens);
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

interface DateCodeLensProps {
    editor: RefObject<editor.IStandaloneCodeEditor>;
    model: RefObject<Observable<editor.ITextModel | null>>;
}

export const DateCodeLens: FC<DateCodeLensProps> = ({ editor, model }) => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const datesByLines = useMemo(() => groupBy(tokens, (token) => token.line), [tokens]);

    const handleTokensUpdate = useCallback(
        (newTokens: Token[]) => {
            const dateTokens = newTokens.filter((x) => x.type.startsWith("date"));
            if (isEqual(tokens, dateTokens)) return;
            setTokens(dateTokens);
        },
        [tokens],
    );

    useEffect(() => {
        const subscription = model.current
            ?.pipe(
                filter(Boolean),
                map(getModelTokensSubject),
                mergeMap((tokens) => tokens),
            )
            .subscribe(handleTokensUpdate);
        return () => subscription?.unsubscribe();
    }, [handleTokensUpdate, model]);

    return (
        <>
            {Object.entries(datesByLines).map(([, tokens], index) => (
                <DateLineWidgets key={index} editor={editor} tokens={tokens} />
            ))}
        </>
    );
};
