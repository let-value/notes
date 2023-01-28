import { container } from "@/container";
import { CompensatedToken } from "@/editor/services/tokensService";
import { ReactiveValue } from "@/utils";
import { groupBy, isEqual } from "lodash-es";
import { Item, WorkspaceId } from "models";
import { editor } from "monaco-editor";
import { useObservable } from "observable-hooks";
import { useObservableState } from "observable-hooks/dist/cjs/use-observable-state";
import { useSubscription } from "observable-hooks/dist/cjs/use-subscription";
import { FC, useCallback, useMemo, useState } from "react";
import { switchMap } from "rxjs";
import { DateLineWidgets } from "./DateLineWidgets";

const tokensService = container.get("tokensService");

interface DateCodeLensProps {
    workspaceId: WorkspaceId;
    item: Item;
    editor$: ReactiveValue<editor.IStandaloneCodeEditor>;
}

export const DateCodeLens: FC<DateCodeLensProps> = ({ workspaceId, item, editor$ }) => {
    const [tokens, setTokens] = useState<CompensatedToken[]>([]);
    const datesByLines = useMemo(() => groupBy(tokens, (token) => token.line), [tokens]);

    const handleTokensUpdate = useCallback(
        (newTokens: CompensatedToken[]) => {
            const dateTokens = newTokens.filter((x) => x.type.startsWith("date"));
            if (isEqual(tokens, dateTokens)) return;
            setTokens(dateTokens);
        },
        [tokens],
    );

    const editor = useObservableState(editor$);
    const tokens$ = useObservable(() =>
        editor$.valuePipe.pipe(switchMap((editor) => tokensService.getEditorCompensatedTokens(editor))),
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
