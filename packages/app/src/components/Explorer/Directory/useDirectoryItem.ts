import { ListItem } from "@/atom/workspace";
import { MouseEvent, useCallback } from "react";

export interface DirectoryHandlersProps {
    item: ListItem<true>;
    onSelect: (item: ListItem<true>, event: MouseEvent) => void;
}

export function useDirectoryHandlers({ item, onSelect }: DirectoryHandlersProps) {
    const handleSelect = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();

            onSelect(item, event);
        },
        [item, onSelect],
    );

    return {
        handleSelect,
    };
}
