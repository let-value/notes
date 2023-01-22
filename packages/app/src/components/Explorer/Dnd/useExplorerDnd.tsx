import { ListItem } from "@/atom/workspace";
import { expandedItemsState, useExpandItem } from "@/atom/workspace/items/expandedItemsState";
import { selectedItemsState } from "@/atom/workspace/items/selectedItemsState";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import cx from "classnames";
import { RefCallback, useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./dnd.module.scss";
import { overGroupState } from "./overGroupState";

export const useExplorerDnd = (item: ListItem, idPostfix = "", disableDrag = false) => {
    const selected = useRecoilValue(selectedItemsState);
    const expanded = useRecoilValue(expandedItemsState);
    const expandItem = useExpandItem();

    const isSelected = useMemo(() => selected.has(item.path), [item, selected]);

    const dragItem = useMemo(() => (isSelected ? Array.from(selected.values()) : [item]), [isSelected, item, selected]);

    const [overGroup, setOverGroup] = useRecoilState(overGroupState);

    const isOverGroup = useMemo(
        () => item.path == overGroup?.path || item.parents?.some((x) => x.path == overGroup?.path),
        [overGroup, item],
    );

    const itemGroup = useMemo(() => (item.isDirectory ? item : item.parents?.at(-1)), [item]);

    const { isOver, setNodeRef: setDropRef } = useDroppable({
        id: `droppable${item.path}${idPostfix}`,
        data: itemGroup,
    });

    const timer = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!item.isDirectory || expanded.has(item.path)) {
            return;
        }

        if (isOver) {
            timer.current = setTimeout(() => {
                expandItem(item.path);
            }, 300) as unknown as number;
        } else {
            clearTimeout(timer.current);
        }
    }, [itemGroup, isOver, setOverGroup, item.isDirectory, item.path, expanded, expandItem]);

    const {
        attributes,
        listeners,
        setNodeRef: setDragRef,
    } = useDraggable({
        id: `draggable${item.path}${idPostfix}`,
        data: dragItem,
    });

    const setRef = useCallback<RefCallback<HTMLElement>>(
        (element) => {
            setDropRef(element);
            if (disableDrag) {
                return;
            }
            setDragRef(element);
        },
        [disableDrag, setDragRef, setDropRef],
    );

    const className = cx({ [styles.over]: isOverGroup });

    return { setRef, className, attributes, listeners };
};
