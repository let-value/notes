import { ListItem } from "@/atom/workspace";
import { Tag } from "@blueprintjs/core";
import { DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent, useDndMonitor } from "@dnd-kit/core";
import { Item } from "models";
import { createRef, FC, MutableRefObject, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useKeyPress } from "react-use";
import { useRecoilState } from "recoil";
import { overGroupState } from "./overGroupState";
import useMouseState from "./useMouseState";

export interface DragPreviewProps {
    items?: Item[];
}

const ref = createRef<HTMLElement>();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
(ref as MutableRefObject<HTMLElement>).current = document.getElementById("root")!;

const tagOffset = 10;

export const DragPreview: FC<DragPreviewProps> = () => {
    const [altKey] = useKeyPress((event) => event.key === "Alt" || event.altKey);
    const { x, y } = useMouseState();

    const [dragItems, setDragItems] = useState<ListItem[] | undefined>(undefined);

    const [overGroup, setOverGroup] = useRecoilState(overGroupState);

    const handleStart = useCallback((event: DragStartEvent) => {
        const dragItems = event.active.data.current as ListItem[];
        setDragItems(dragItems);
    }, []);

    const handleOver = useCallback(
        (event: DragOverEvent) => {
            const group = event.over?.data.current as ListItem;
            if (dragItems?.every((item) => item.parents.at(-1)?.path === group?.path)) {
                setOverGroup(undefined);
                return;
            }

            setOverGroup(group);
        },
        [dragItems, setOverGroup],
    );

    const handleEnd = useCallback(
        (event: DragEndEvent | DragCancelEvent) => {
            console.log(event);
            setDragItems(undefined);
            setOverGroup(undefined);
        },
        [setOverGroup],
    );

    useDndMonitor({
        onDragStart: handleStart,
        onDragOver: handleOver,
        onDragEnd: handleEnd,
        onDragCancel: handleEnd,
    });

    if (dragItems && ref.current) {
        return createPortal(
            <Tag className="absolute" style={{ left: x + tagOffset, top: y + tagOffset }}>
                {overGroup ? altKey ? <span>Copy </span> : <span>Move </span> : null}
                {dragItems.length > 1 ? <span>{dragItems.length} items</span> : <span>{dragItems[0].name}</span>}
                {overGroup ? <span> to {overGroup.name}</span> : null}
            </Tag>,
            ref.current,
        );
    }

    return null;
};
