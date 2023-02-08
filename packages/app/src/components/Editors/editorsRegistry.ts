import { ListItem } from "@/atom/workspace";
import { ComponentType } from "react";
import { Database } from "./Database/Database";
import { EditorProps } from "./EditorProps";
import { Note } from "./Note/Note";
import { TextEditor } from "./TextEditor/TextEditor";

type LanguageEditors = Record<string, ComponentType<EditorProps>>;

const registry: Record<string, LanguageEditors> = {
    markdown: {
        preview: Note,
    },
    csv: {
        default: Database,
        source: TextEditor,
    },
};

export const defaultEditor = "default";

export function resolveEditors(item: ListItem<false>): LanguageEditors {
    return {
        default: TextEditor,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...registry?.[item.language!],
    };
}

export function resolveEditor(
    item: ListItem<false>,
    requestedEditor = defaultEditor,
): React.ComponentType<EditorProps> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const editor = registry?.[item.language!]?.[requestedEditor];

    return editor ?? TextEditor;
}
