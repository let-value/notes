import { ReactiveComponentProperty } from "app/src/utils";
import { ComponentType } from "react";
import { mergeMap } from "rxjs";
import { DocumentNode } from "./DocumentNode";

export interface FileContentChildrenProps {
    content: string;
}

export interface FileContentNodeProps {
    children: ComponentType<FileContentChildrenProps>;
}

export class FileContentNode extends DocumentNode<FileContentNodeProps> {
    content = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(mergeMap(() => this.context.parent.readFile())),
    );

    render() {
        if (this.content.value === undefined) {
            return null;
        }

        const Component = this.props.children;

        return <Component content={this.content.value} />;
    }
}
