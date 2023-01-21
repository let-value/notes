import { ReactiveComponentProperty } from "app/src/utils";
import { ComponentType } from "react";
import { map, mergeMap } from "rxjs";
import { DocumentNode } from "./DocumentNode";

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
            mergeMap((item) => this.context.root.registry.current.getLink(item)),
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
