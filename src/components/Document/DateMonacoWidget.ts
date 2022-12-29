import { Token } from "@/domain";
import { editor } from "monaco-editor";
import { v4 as uuidv4 } from "uuid";

class DateViewZone implements editor.IViewZone {
    suppressMouseDown = true;
    heightInLines = 1;
    domNode: HTMLElement;

    constructor(public afterLineNumber: number) {
        this.domNode = document.createElement("div");
        this.domNode.style.border = "1px solid black";
    }
}

class DateContentWidget implements editor.IContentWidget {
    allowEditorOverflow?: boolean | undefined;
    suppressMouseDown?: boolean | undefined;
    private id: string;
    private domNode: HTMLDivElement;
    private position: editor.IContentWidgetPosition;
    constructor(token: Token) {
        this.id = uuidv4();
        this.domNode = document.createElement("div");
        this.domNode.style.border = "1px solid black";
        this.position = {
            position: {
                lineNumber: token.line + 1,
                column: token.start + 1,
            },
            preference: [editor.ContentWidgetPositionPreference.ABOVE, editor.ContentWidgetPositionPreference.BELOW],
            range: {
                startLineNumber: token.line + 1,
                startColumn: token.start + 1,
                endLineNumber: token.line + 1,
                endColumn: token.end + 1,
            },
        };
    }
    getId() {
        return this.id;
    }
    getDomNode() {
        return this.domNode;
    }
    getPosition() {
        return this.position;
    }
}

export class DateMonacoWidget {
    private lineNumber?: number;
    private viewZoneId?: string;
    private contentWidgets?: Map<number, DateContentWidget>;
    private isDisposed = false;
    private editor?: editor.IStandaloneCodeEditor | null;

    updateTokens(editor: editor.IStandaloneCodeEditor | null, tokens: Token[]) {
        this.editor = editor;
        const lineNumber = tokens?.[0]?.line;
        this.tryCreateViewZone(editor, lineNumber);
        this.tryCreateContentWidgets(tokens);
        const contentWidgets = tokens.map((x, index) => [index, new DateContentWidget(x)] as const);
        this.contentWidgets = new Map(contentWidgets);

        for (const [, contentWidget] of contentWidgets) {
            this.editor.addContentWidget(contentWidget);
        }
    }
    private tryCreateViewZone(editor: editor.IStandaloneCodeEditor | null, lineNumber: number) {
        if (lineNumber === this.lineNumber && this.viewZoneId) {
            return;
        }

        this.disposeViewZone();

        if (!this.editor) {
            return;
        }

        this.editor.changeViewZones(({ addZone }) => {
            this.viewZoneId = addZone(new DateViewZone(lineNumber));
        });
    }
    private disposeViewZone() {
        if (this.viewZoneId && this.editor) {
            this.editor.changeViewZones(({ removeZone }) => {
                if (this.viewZoneId) {
                    removeZone(this.viewZoneId);
                }
            });
        }
    }
    private tryCreateContentWidgets(tokens: Token[]) {}

    getContentWidget(token: Token) {
        return this.contentWidgets.get(token);
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }

        this.isDisposed = true;

        this.disposeViewZone();
        for (const contentWidget of this.contentWidgets.values()) {
            this.editor.removeContentWidget(contentWidget);
        }
    }
}
