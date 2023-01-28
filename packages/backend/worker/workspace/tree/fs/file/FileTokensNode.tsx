import { parseModelTokens } from "app/src/editor/tokens/parseModelTokens";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { editor, Uri } from "monaco-editor";
import { ComponentType } from "react";
import { map, switchMap } from "rxjs";
import { container } from "../../../../container";
import { DocumentNode } from "./DocumentNode";

const queue = container.get("queue");

export interface FileTokensChildrenProps {
    tokens: Token[];
}

export interface FileTokensNodeProps {
    content: string;
    children: ComponentType<FileTokensChildrenProps>;
}

export class FileTokensNode extends DocumentNode<FileTokensNodeProps> {
    tokens$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.content),
            switchMap((content) => queue.add(() => this.getTokens(content))),
        ),
    );

    async getTokens(content: string) {
        const {
            language,
            props: { item },
        } = this.context.parent;

        const uri = Uri.from({ ...Uri.file(item.path), authority: "backend" });

        let model = editor.getModel(uri);
        if (model) {
            model.setValue(content);
        } else {
            model = editor.createModel(content, language, uri);
        }
        try {
            return parseModelTokens(model);
        } finally {
            model.dispose();
        }
    }

    render() {
        if (this.tokens$.value === undefined) {
            return null;
        }

        const Component = this.props.children;

        return <Component tokens={this.tokens$.value} />;
    }
}
