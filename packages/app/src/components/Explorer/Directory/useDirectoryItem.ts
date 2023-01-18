import { Item } from "models";
import { useCallback } from "react";

export interface DirectoryHandlersProps {
    item: Item<true>;
    onSelect: (item: Item<true>) => void;
}

export function useDirectoryHandlers({ item, onSelect }: DirectoryHandlersProps) {
    const handleSelect = useCallback(() => {
        onSelect(item);
    }, [item, onSelect]);

    return {
        handleSelect,
    };
}
