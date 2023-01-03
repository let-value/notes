import { TreeItem } from "models";
import { useContext, useMemo } from "react";
import { fileComponent } from "../Document";
import { WorkspaceContext } from "./WorkspaceContext";

export interface FileProps {
    item: TreeItem;
}

export function File({ item }: FileProps) {
    const store = useContext(WorkspaceContext);
    const language = useMemo(() => store.parse.getLanguage(item), [item, store.parse]);

    const Component = fileComponent[language];

    if (!Component) {
        return null;
    }

    return <Component item={item} />;
}
