import { Token } from "@/domain";
import { editor } from "monaco-editor";
import { DateContentWidget } from "./DateContentWidget";
import { DateViewZone } from "./DateViewZone";

export class DateWidget {
    private contentWidgets = new Map<number, DateContentWidget>();
    private viewZone?: DateViewZone;
    constructor(...args: Parameters<DateWidget["updateTokens"]>) {
        this.updateTokens(...args);
    }

    updateTokens(editor: editor.IStandaloneCodeEditor | null, tokens: Token[]) {
        if (!editor) {
            return;
        }

        const lineNumber = tokens?.[0]?.line;

        if (!this.viewZone) {
            this.viewZone = new DateViewZone(editor, lineNumber);
        } else {
            this.viewZone.update(editor, lineNumber);
        }

        for (let i = 0; i < Math.max(tokens.length, this.contentWidgets?.size); i++) {
            const token = tokens[i];
            const contentWidget = this.contentWidgets.get(i);
            if (!token && contentWidget) {
                contentWidget.dispose();
                this.contentWidgets.delete(i);
            } else if (token && !contentWidget) {
                const contentWidget = new DateContentWidget(editor, token);
                this.contentWidgets.set(i, contentWidget);
            }
            if (token && contentWidget) {
                contentWidget.update(editor, token);
            }
        }
    }

    getContentWidget(token: number) {
        return this.contentWidgets.get(token);
    }

    dispose() {
        this.viewZone?.dispose();
        for (const contentWidget of this.contentWidgets.values()) {
            contentWidget?.dispose();
        }
    }
}
