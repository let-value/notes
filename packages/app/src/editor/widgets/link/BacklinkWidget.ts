import { editor, Token } from "monaco-editor";

export class BacklinkWidget {
    constructor(...args: Parameters<BacklinkWidget["updateTokens"]>) {
        this.updateTokens(...args);
    }

    updateTokens(editor: editor.IStandaloneCodeEditor | null, tokens: Token[]) {
        if (!editor) {
            return;
        }
    }
}
