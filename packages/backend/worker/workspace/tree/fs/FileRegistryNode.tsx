import { createReplaySubject } from "app/src/utils";
import { Item } from "models";
import { format, parse, ParsedPath, sep } from "path";
import { BehaviorSubject, firstValueFrom, map } from "rxjs";
import { TreeContextProps, TreeNode } from "../TreeNode";
import { WorkspaceNode } from "../WorkspaceNode";
import { FileNode } from "./FileNode";

type Uri = {
    uri: ParsedPath;
    item: Item<false>;
};

export class FileRegistryNode extends TreeNode {
    declare context: TreeContextProps<WorkspaceNode>;
    declare children$: BehaviorSubject<FileNode[]>;
    declare addChildren: (node: FileNode) => void;
    declare removeChildren: (node: FileNode) => void;

    deepReady$ = new BehaviorSubject(true);
    progress$ = new BehaviorSubject([0, 0] as [number, number]);

    registry$ = createReplaySubject(
        this.children$.pipe(
            map((files) => files.map((file): Uri => ({ uri: parse(file.props.item.path), item: file.props.item }))),
        ),
        1,
    );

    async resolveLink(link: string) {
        await this.context.root.deepReady;
        await this.context.parent.deepReady;

        const uri = parse(link);

        return this.registry$.pipe(
            //todo: pause when registry not ready
            map((registry) => {
                const amongst: Uri[] = [];
                for (const file of registry) {
                    if (uri.ext && file.uri.ext !== uri.ext) {
                        continue;
                    }

                    if (file.uri.name !== uri.name) {
                        continue;
                    }

                    if (!file.uri.dir.endsWith(uri.dir)) {
                        continue;
                    }

                    amongst.push(file);
                }

                amongst.sort((a, b) => a.uri.dir.localeCompare(b.uri.dir));

                return amongst?.[0]?.item;
            }),
        );
    }

    async getLink(item: Item<false>) {
        await this.context.parent.deepReady;

        const uri = parse(item.path);
        const workspaceUri = parse(this.context.parent.root$.value.path);

        const forPath = format({
            dir: uri.dir,
            name: uri.name,
        });

        const registry = await firstValueFrom(this.registry$);

        const amongst: string[] = [];
        for (const file of registry) {
            if (file.uri.name !== uri.name) {
                continue;
            }

            amongst.push(
                format({
                    dir: file.uri.dir,
                    name: file.uri.name,
                }),
            );
        }

        const needleTokens = forPath.split(sep).reverse();
        const haystack = amongst.filter((value) => value !== forPath).map((value) => value.split(sep).reverse());

        let tokenIndex = 0;
        let res = needleTokens;
        while (tokenIndex < needleTokens.length) {
            for (let j = haystack.length - 1; j >= 0; j--) {
                if (haystack[j].length < tokenIndex || needleTokens[tokenIndex] !== haystack[j][tokenIndex]) {
                    haystack.splice(j, 1);
                }
            }
            if (haystack.length === 0) {
                res = needleTokens.splice(0, tokenIndex + 1);
                break;
            }
            tokenIndex++;
        }

        const identifier = res
            .filter((token) => token.trim() !== "")
            .reverse()
            .join(sep)
            .replace(workspaceUri.name, "");

        return identifier;
    }

    render() {
        return null;
    }
}
