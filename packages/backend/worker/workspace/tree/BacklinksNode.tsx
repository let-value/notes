import { ReactiveComponentProperty } from "app/src/utils";
import { map, mergeMap } from "rxjs";
import { DocumentNode } from "./fs/file/DocumentNode";

export class BacklinksNode extends DocumentNode {
    backlinks$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() => this.context.root.graph.current.graph$),
            map((links) => links[this.context.parent.props.item.path]),
        ),
    );

    render() {
        return null;
    }
}
