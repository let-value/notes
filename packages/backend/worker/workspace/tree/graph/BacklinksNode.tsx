import { createReplaySubject } from "app/src/utils";
import { map } from "rxjs";
import { DocumentNode } from "../fs/file/DocumentNode";

export class BacklinksNode extends DocumentNode {
    backlinks$ = createReplaySubject(
        this.context.root.graphRef.current.graph$.pipe(map((links) => links[this.context.parent.props.item.path])),
    );

    render() {
        return null;
    }
}
