import { parseModelTokens } from "app/src/editor/tokens/parseModelTokens";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { editor, Uri } from "monaco-editor";
import { ComponentType } from "react";
import { distinctUntilChanged, map, mergeMap } from "rxjs";
import { DocumentNode } from "./DocumentNode";

export interface FileTokensChildrenProps {
    tokens: Token[];
}

export interface FileTokensNodeProps {
    content: string;
    children: ComponentType<FileTokensChildrenProps>;
}

export class FileTokensNode extends DocumentNode<FileTokensNodeProps> {
    tokens = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.content),
            distinctUntilChanged(),
            mergeMap((content) => this.getTokens(content)),
        ),
    );

    async getTokens(content: string) {
        const {
            language,
            props: { item },
        } = this.context.parent;
        const model = editor.createModel(content, language, Uri.file(item.path));
        const tokens = parseModelTokens(model);
        model.dispose();
        return tokens;
    }

    render() {
        if (this.tokens.value === undefined) {
            return null;
        }

        const Component = this.props.children;

        return <Component tokens={this.tokens.value} />;
    }
}
