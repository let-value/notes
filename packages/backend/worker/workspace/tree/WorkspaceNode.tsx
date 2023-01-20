import { ReactiveComponentProperty } from "app/src/utils";
import { createRef } from "react";
import { combineLatest, map, mergeMap } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";
import { DirectoryNode } from "./DirectoryNode";
import { FileRegistryNode } from "./FileRegistryNode";
import { HyperFormulaNode } from "./HyperFormulaNode";
import { TreeContext, TreeContextProps, TreeNode } from "./TreeNode";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export class WorkspaceNode extends TreeNode<WorkspaceProps> {
    directory = createRef<DirectoryNode>();
    registry = createRef<FileRegistryNode>();
    hyperFormula = createRef<HyperFormulaNode>();
    root$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.store.workspace),
            mergeMap((workspace) => this.props.store.fs.initializeWorkspace(workspace)),
        ),
    );

    componentDidMount() {
        super.componentDidMount();
        this.props.store.root.next(this);
    }

    ready$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() =>
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
            ),
        ),
    );

    newContext: TreeContextProps = { root: this, store: this.props.store, parent: this };

    render() {
        return (
            <TreeContext.Provider value={this.newContext}>
                <FileRegistryNode ref={this.registry} />
                <HyperFormulaNode ref={this.hyperFormula} />
                {this.root$.value && <DirectoryNode ref={this.directory} key="directory" item={this.root$.value} />}
            </TreeContext.Provider>
        );
    }
}
