import { ReactiveValue } from "app/src/utils";
import { Item, Token } from "models";
import { useObservableState } from "observable-hooks";
import path from "path";
import { FC, useContext, useEffect, useMemo } from "react";
import { firstValueFrom, map } from "rxjs";
import { TreeContext } from "../TreeContext";
import { TreeNode } from "../TreeNode";
import { TreeFileNode } from "../Workspace/File";
import { WorkspaceContext } from "../Workspace/WorkspaceContext";
import { FilePropsWithTokens } from "./FileComponentProps";

export function getTokensNodePath(item: Item<false>) {
    return path.resolve(item.path, "tokens");
}

export class TreeTokensNode extends TreeNode {
    tokens = new ReactiveValue<Token[]>();
    declare parent: TreeFileNode;
    constructor(parent: TreeNode) {
        super({ path: getTokensNodePath(parent.item), name: "tokens", isDirectory: false }, parent);
        if (parent.constructor !== TreeFileNode) {
            throw new Error("parent must be TreeFileNode");
        }
    }
    get ready() {
        return firstValueFrom(this.tokens.valuePipe.pipe(map(() => true)));
    }
}

export function withTokens<TProps extends FilePropsWithTokens>(WrappedComponent: FC<TProps>) {
    return function WithSubscription(item: TProps) {
        const store = useContext(WorkspaceContext);
        const parent = useContext(TreeContext);
        const instance = useMemo(() => new TreeTokensNode(parent), [parent]);
        useEffect(() => {
            (async () => {
                const tokens = await store.parse.getTokens(item, instance.parent.language);
                instance.tokens.next(tokens);
            })();
        }, [instance.parent.language, instance.tokens, item, store.parse]);

        const tokens = useObservableState(instance.tokens.valuePipe, undefined);

        return <WrappedComponent {...item} tokens={tokens} />;
    };
}
