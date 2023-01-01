import { Token } from "@/domain";
import { isEqual } from "lodash-es";
import { editor } from "monaco-editor";
import { RefObject, useCallback, useEffect, useState } from "react";
import { map, mergeMap, Observable } from "rxjs";
import { getModelTokensSubject } from "./tokensRepository";

export function useDocumentBacklinks(model: RefObject<Observable<editor.ITextModel>>) {
    const [backlinks, setBacklinks] = useState<Token[]>([]);

    const handleTokensUpdate = useCallback(
        (tokens: Token[]) => {
            const newBacklinks = tokens.filter((x) => x.type.startsWith("backlink"));
            if (isEqual(backlinks, newBacklinks)) return;
            setBacklinks(newBacklinks);
        },
        [backlinks],
    );

    useEffect(() => {
        const subscription = model.current
            ?.pipe(
                map(getModelTokensSubject),
                mergeMap((tokens) => tokens),
            )
            .subscribe(handleTokensUpdate);
        return () => subscription?.unsubscribe();
    }, [handleTokensUpdate, model]);

    return { backlinks };
}
