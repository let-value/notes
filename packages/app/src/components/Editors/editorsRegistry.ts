import { RichItem } from "@/atom/workspace";
import { Database } from "./Database/Database";
import { EditorProps } from "./EditorProps";
import { Note } from "./Note/Note";
import { TextEditor } from "./TextEditor/TextEditor";

const registry = {
    markdown: {
        default: Note,
        preview: Note,
    },
    csv: {
        default: Database,
        source: TextEditor,
    },
};

export function resolveEditor(item: RichItem<false>, requestedEditor = "default"): React.ComponentType<EditorProps> {
    const editor = registry?.[item.language as never]?.[requestedEditor];

    return editor ?? TextEditor;
}
