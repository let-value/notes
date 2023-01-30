import { parseModelTokens } from "app/src/editor/tokens/parseModelTokens";
import { editor, Uri } from "monaco-editor";
import { FileNode } from "../workspace/tree/fs/FileNode";

export async function getTokens(parent: FileNode, content: string) {
    const {
        language,
        props: { item },
    } = parent;

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
