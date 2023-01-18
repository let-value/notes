import { ReactiveComponentProperty } from "app/src/utils";
import { combineLatest, filter, firstValueFrom, map, mergeMap } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";
import { DirectoryNode } from "./DirectoryNode";
import { TreeContext, TreeNode } from "./TreeItemNode";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export class WorkspaceNode extends TreeNode<WorkspaceProps> {
    root = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.store.workspace),
            mergeMap((workspace) => this.props.store.fs.initializeWorkspace(workspace)),
        ),
    );

    componentDidMount() {
        super.componentDidMount();
        this.props.store.root.next(this);
    }

    get ready() {
        return firstValueFrom(
            combineLatest([this.root.pipeline$, this.children]).pipe(
                map(([root, children]) => !!root && children.size === 1),
                filter(Boolean),
            ),
        );
    }

    render() {
        const { store } = this.props;

        return (
            <TreeContext.Provider value={{ store, parent: this }}>
                {this.root.value && <DirectoryNode item={this.root.value} />}
            </TreeContext.Provider>
        );
    }
}
