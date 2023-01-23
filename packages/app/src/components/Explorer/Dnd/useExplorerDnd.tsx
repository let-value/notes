import { ListItem } from "@/atom/workspace";
import { expandedItemsState, useExpandItem } from "@/atom/workspace/items/expandedItemsState";
import { selectedItemsState } from "@/atom/workspace/items/selectedItemsState";
import { useDropItems } from "@/atom/workspace/items/useDropItems";
import cx from "classnames";
import { RefCallback, useCallback, useEffect, useMemo, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./dnd.module.scss";
import { overGroupState } from "./overGroupState";

export const DND_TYPE = "listItems";

interface DropResult {
    dropEffect: string;
    target: ListItem<true>;
}

export const useExplorerDnd = (item: ListItem, disableDrag = false) => {
    const selected = useRecoilValue(selectedItemsState);
    const expanded = useRecoilValue(expandedItemsState);
    const expandItem = useExpandItem();

    const dropItems = useDropItems();

    const isSelected = useMemo(() => selected.has(item.path), [item, selected]);

    const dragItem = useMemo(() => (isSelected ? Array.from(selected.values()) : [item]), [isSelected, item, selected]);

    const [overGroup, setOverGroup] = useRecoilState(overGroupState);

    const isOverGroup = useMemo(
        () => item.path == overGroup?.path || item.parents?.some((x) => x.path == overGroup?.path),
        [overGroup, item],
    );

    const itemGroup = useMemo(() => (item.isDirectory ? item : item.parents?.at(-1) ?? item), [item]);

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: [NativeTypes.FILE, DND_TYPE],
            options: itemGroup,
            canDrop(args, monitor) {
                const type = monitor.getItemType();
                if (type === NativeTypes.FILE) {
                    return true;
                }

                if (type === DND_TYPE) {
                    const items = args as ListItem[];

                    const sameDirectory = items.every(
                        (item) => item.parents.at(-1)?.path === itemGroup?.path || item.path === itemGroup?.path,
                    );

                    const isParent = items.some((item) => itemGroup?.parents?.some((x) => x.path === item.path));

                    return !sameDirectory && !isParent;
                }

                return true;
            },
            collect(monitor) {
                return { isOver: monitor.isOver({ shallow: true }), canDrop: monitor.canDrop() };
            },
            drop(_args, monitor) {
                if (monitor.didDrop()) {
                    return;
                }

                if (monitor.getItemType() === NativeTypes.FILE) {
                    throw new Error("Not implemented");
                }

                return {
                    target: itemGroup,
                };
            },
        }),
        [itemGroup],
    );

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

    const [, drag] = useDrag(
        () => ({
            type: DND_TYPE,
            item: dragItem,
            end(item, monitor) {
                const dropResult = monitor.getDropResult() as DropResult;

                if (!dropResult) {
                    return;
                }

                dropItems(item, dropResult.target, dropResult?.dropEffect);
            },
        }),
        [dragItem, dropItems],
    );

    const setRef = useCallback<RefCallback<HTMLElement>>(
        (element) => {
            drop(element);
            if (disableDrag) {
                return;
            }
            drag(element);
        },
        [disableDrag, drag, drop],
    );

    const className = cx({ [styles.over]: isOverGroup, [styles.cannotDrop]: isOver && !canDrop });

    return { setRef, className };
};
