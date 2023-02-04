import { createReplaySubject } from "app/src/utils";
import { backend } from "messaging";
import { DatabaseView } from "models";
import { ReactNode } from "react";
import { map, withLatestFrom } from "rxjs";
import { container } from "../../../../../container";
import { TreeContextProps, TreeNode } from "../../../TreeNode";
import { SheetNode } from "./SheetNode";

const dispatcher = container.get("dispatcher");

interface ViewNodeProps {
    view: DatabaseView;
}

export class ViewNode extends TreeNode<ViewNodeProps> {
    declare context: TreeContextProps<SheetNode>;

    data$ = createReplaySubject(
        this.context.parent.computed$.pipe(
            withLatestFrom(this.context.parent.metaProperty$.pipeline$),
            map(([computed, meta]) => {
                return computed;
            }),
        ),
        1,
    );

    private notifyChange = this.data$.subscribe(async (data) => {
        await dispatcher.send(
            backend.workspace.database.view.response(data, undefined, {
                workspaceId: this.context.store.workspace.id,
                path: this.context.parent.context.parent.props.item.path,
                view: this.props.view.name,
            }),
        );
    });

    render(): ReactNode {
        return null;
    }
}
