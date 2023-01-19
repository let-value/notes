import { ReactiveComponentProperty } from "app/src/utils";
import { combineLatest, map, mergeMap } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";
import { DirectoryNode } from "./DirectoryNode";
import { FileRegistryNode } from "./FileRegistryNode";
import { TreeContext, TreeContextProps, TreeNode } from "./TreeNode";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export class WorkspaceNode extends TreeNode<WorkspaceProps> {
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
                combineLatest([this.root$.pipeline$, this.children]).pipe(
                    map(([root, children]) => {
                        if (!root) {
                            return false;
                        }
                        return !!Array.from(children.values()).find((child) => child instanceof DirectoryNode);
                    }),
                ),
            ),
        ),
    );

    newContext: TreeContextProps = { store: this.props.store, parent: this };

    render() {
        return (
            <TreeContext.Provider value={this.newContext}>
                <FileRegistryNode />
                {this.root$.value && <DirectoryNode key="directory" item={this.root$.value} />}
            </TreeContext.Provider>
        );
    }
}
