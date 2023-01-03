import { backlinkRegex } from "app/src/editor/language/markdown";
import { useAsyncMemo } from "app/src/utils";
import { Token, TreeItem } from "models";
import { useContext, useMemo } from "react";
import { WorkspaceContext } from "../../Workspace/WorkspaceContext";

interface MarkdownBacklinkProps {
    from: TreeItem;
    token: Token;
}

export function MarkdownBacklink({ from, token }: MarkdownBacklinkProps) {
    const store = useContext(WorkspaceContext);
    const [, path, name] = useMemo(() => backlinkRegex.exec(token.value), [token.value]);
    const to = useAsyncMemo(async () => {
        const files = await store.fs.getItems();
        return files.find((file) => file.path.includes(path) && !file.isDirectory);
    }, [store.fs]);
    console.log("Backlink", from, to, token);

    return null;
}
