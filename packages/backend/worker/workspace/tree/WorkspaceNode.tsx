import { createReplaySubject, ReactiveComponentProperty } from "app/src/utils";
import { createRef } from "react";
import { combineLatest, map, switchMap } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";
import { HyperFormulaNode } from "./database/HyperFormulaNode";
import { DirectoryNode } from "./fs/DirectoryNode";
import { FileNode } from "./fs/FileNode";
import { FileRegistryNode } from "./fs/FileRegistryNode";
import { GraphNode } from "./graph/GraphNode";
import { MetadataNode } from "./metadata/MetadataNode";
import { TreeContext, TreeContextProps, TreeNode } from "./TreeNode";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export class WorkspaceNode extends TreeNode<WorkspaceProps> {
    directoryRef = createRef<DirectoryNode>();
    registryRef = createRef<FileRegistryNode>();
    hyperFormulaRef = createRef<HyperFormulaNode>();
    graphRef = createRef<GraphNode>();
    metadataRef = createRef<MetadataNode>();

    root$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.store.workspace),
            switchMap((workspace) => this.props.store.fs.initializeWorkspace(workspace)),
        ),
    );

    componentDidMount() {
        super.componentDidMount();
        this.props.store.root.next(this);
    }

    ready$ = createReplaySubject(
        combineLatest([this.root$.pipeline$, this.children$]).pipe(
            map(([root, children]) => {
                if (!root) {
                    return false;
                }

                if (!children.find((x) => x instanceof DirectoryNode)) {
                    return false;
                }

                return true;
            }),
        ),
        1,
    );

    newContext: TreeContextProps = { root: this, store: this.props.store, parent: this };

    async updateLinks(oldNode: DirectoryNode | FileNode, newNode: DirectoryNode | FileNode) {
        await newNode.deepReady;

        console.log("updateLinks", oldNode, newNode);
    }

    render() {
        return (
            <TreeContext.Provider value={this.newContext}>
                <FileRegistryNode ref={this.registryRef} />
                <HyperFormulaNode ref={this.hyperFormulaRef} />
                <GraphNode ref={this.graphRef} />

                {this.root$.value && (
                    <DirectoryNode ref={this.directoryRef} item={this.root$.value}>
                        <MetadataNode ref={this.metadataRef} />
                    </DirectoryNode>
                )}
            </TreeContext.Provider>
        );
    }
}
