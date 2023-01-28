import { ReactiveComponentProperty } from "app/src/utils";
import { ComponentType } from "react";
import { switchMap } from "rxjs";
import { container } from "../../../../container";
import { DocumentNode } from "./DocumentNode";

const queue = container.get("queue");

export interface FileContentChildrenProps {
    content: string;
}

export interface FileContentNodeProps {
    children: ComponentType<FileContentChildrenProps>;
}

export class FileContentNode extends DocumentNode<FileContentNodeProps> {
    content$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(switchMap(() => queue.add(() => this.context.parent.readFile()))),
    );

    render() {
        if (this.content$.value === undefined) {
            return null;
        }

        const Component = this.props.children;

        return <Component content={this.content$.value} />;
    }
}
