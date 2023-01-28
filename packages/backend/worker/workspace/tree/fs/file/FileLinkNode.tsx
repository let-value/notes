import { ReactiveComponentProperty } from "app/src/utils";
import { ComponentType } from "react";
import { map, switchMap } from "rxjs";
import { container } from "../../../../container";
import { DocumentNode } from "./DocumentNode";

const queue = container.get("queue");

export interface FileLinkChildrenProps {
    link: string;
}

export interface FileLinkNodeProps {
    children: ComponentType<FileLinkChildrenProps>;
}

export class FileLinkNode extends DocumentNode<FileLinkNodeProps> {
    link$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map(() => this.context.parent.props.item),
            switchMap((item) => queue.add(() => this.context.root.registryRef.current.getLink(item))),
        ),
    );

    render() {
        if (this.link$.value === undefined) {
            return null;
        }

        const Component = this.props.children;

        return <Component link={this.link$.value} />;
    }
}
