import { useAsyncMemo } from "app/src/utils";
import { TreeItem } from "models";
import { useContext, useMemo } from "react";
import { WorkspaceContext } from "../../Workspace/WorkspaceContext";
import { MarkdownBacklink } from "./MarkdownBacklink";

interface MarkdownProps {
    item: TreeItem;
}

export function Markdown({ item }: MarkdownProps) {
    const store = useContext(WorkspaceContext);
    const tokens = useAsyncMemo(() => store.parse.getTokens(item), [item, store.parse], undefined);
    const backlinks = useMemo(() => tokens?.filter((token) => token.type.startsWith("backlink")), [tokens]);

    return (
        <>
            {backlinks?.map((token, index) => (
                <MarkdownBacklink key={index} from={item} token={token} />
            ))}
        </>
    );
}
