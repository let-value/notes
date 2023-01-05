import { container } from "@/container";
import { groupBy, isEqual } from "lodash-es";
import { Item, Token, WorkspaceId } from "models";
import { editor } from "monaco-editor";
import { useObservable } from "observable-hooks";
import { useObservableState } from "observable-hooks/dist/cjs/use-observable-state";
import { useSubscription } from "observable-hooks/dist/cjs/use-subscription";
import { FC, useCallback, useMemo, useState } from "react";
import { BehaviorSubject, filter, mergeMap } from "rxjs";
import { DateLineWidgets } from "./DateLineWidgets";

const tokensService = container.get("tokensService");

interface DateCodeLensProps {
    workspaceId: WorkspaceId;
    item: Item;
    editorSubject: BehaviorSubject<editor.IStandaloneCodeEditor | undefined>;
}

export const DateCodeLens: FC<DateCodeLensProps> = ({ workspaceId, item, editorSubject }) => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const datesByLines = useMemo(() => groupBy(tokens, (token) => token.line), [tokens]);

    const handleTokensUpdate = useCallback(
        (newTokens: Token[]) => {
            console.log(newTokens);
            const dateTokens = newTokens.filter((x) => x.type.startsWith("date"));
            if (isEqual(tokens, dateTokens)) return;
            setTokens(dateTokens);
        },
        [tokens],
    );

    const editor = useObservableState(editorSubject);
    const tokens$ = useObservable(() =>
        editorSubject.pipe(
            filter(Boolean),
            mergeMap((editor) => tokensService.getEditorTokens(editor)),
            filter(Boolean),
        ),
    );

    useSubscription(tokens$, handleTokensUpdate);

    if (!editor) {
        return null;
    }

    return (
        <>
            {Object.entries(datesByLines).map(([, tokens], index) => (
                <DateLineWidgets key={index} workspaceId={workspaceId} item={item} editor={editor} tokens={tokens} />
            ))}
        </>
    );
};
