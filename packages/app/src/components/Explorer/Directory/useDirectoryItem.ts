import { Item } from "models";
import { MouseEvent, useCallback } from "react";

export interface DirectoryHandlersProps {
    item: Item<true>;
    onSelect: (item: Item<true>, event: MouseEvent) => void;
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
