import { Editor } from "@/editor";
import { isEqual } from "lodash-es";
import { Token } from "models";
import { editor as monacoEditor } from "monaco-editor";
import { v4 as uuidv4 } from "uuid";

export class DateContentWidget implements monacoEditor.IContentWidget {
    allowEditorOverflow?: boolean | undefined;
    suppressMouseDown?: boolean | undefined;
    private id?: string;
    private domNode: HTMLDivElement;
    private position?: monacoEditor.IContentWidgetPosition;
    private editor?: monacoEditor.IStandaloneCodeEditor;
    constructor(...args: Parameters<DateContentWidget["update"]>) {
        this.domNode = document.createElement("div");
        this.domNode.style.border = "1px solid black";
        this.update(...args);
    }
    update(editor: Editor, token: Token) {
        if (!editor) {
            return;
        }

        if (this.editor !== editor) {
            this.id = undefined;
        }

        this.editor = editor;

        const prevPosition = this.position;
        this.position = {
            position: {
                lineNumber: token.line + 1,
                column: token.start + 1,
            },
            preference: [monacoEditor.ContentWidgetPositionPreference.ABOVE],
            range: {
                startLineNumber: token.line + 1,
                startColumn: token.start + 1,
                endLineNumber: token.line + 1,
                endColumn: token.end + 1,
            },
        };

        if (!this.id) {
            this.id = uuidv4();
            this.editor.addContentWidget(this);
            return;
        }

        if (!isEqual(this.position, prevPosition)) {
            this.editor.layoutContentWidget(this);
        }
    }
    dispose() {
        if (!this.id) {
            return;
        }

        this.editor?.removeContentWidget(this);
    }
    getId() {
        return this.id!;
    }
    getDomNode() {
        return this.domNode;
    }
    getPosition() {
        return this.position!;
    }
}
