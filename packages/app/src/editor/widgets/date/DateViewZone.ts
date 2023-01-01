/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Editor } from "@/editor";
import { editor } from "monaco-editor";

export class DateViewZone implements editor.IViewZone {
    suppressMouseDown = true;
    heightInLines = 1;
    domNode: HTMLElement;
    id?: string;

    constructor(private editor: Editor, public afterLineNumber: number) {
        this.domNode = document.createElement("div");
        this.domNode.style.border = "1px solid black";
        this.update(editor, afterLineNumber);
    }
    update(editor: Editor, afterLineNumber: number) {
        if (!editor) {
            return;
        }
        if (this.editor !== editor) {
            this.id = undefined;
        }

        this.editor = editor;
        const prevAfterLineNumber = this.afterLineNumber;
        this.afterLineNumber = afterLineNumber;

        if (!this.id) {
            editor.changeViewZones((changeAccessor) => {
                this.id = changeAccessor.addZone(this);
            });
            return;
        }

        if (this.afterLineNumber !== prevAfterLineNumber) {
            this.editor.changeViewZones((changeAccessor) => {
                changeAccessor.layoutZone(this.id!);
            });
        }
    }
    dispose() {
        if (!this.editor || !this.id) {
            return;
        }
        this.editor.changeViewZones((changeAccessor) => {
            changeAccessor.removeZone(this.id!);
        });
    }
}
