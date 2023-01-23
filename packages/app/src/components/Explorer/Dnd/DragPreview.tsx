import { ListItem } from "@/atom/workspace";
import { Tag } from "@blueprintjs/core";
import { Item } from "models";
import { useForceUpdate } from "observable-hooks";
import { createRef, FC, MutableRefObject, useCallback, useEffect, useState } from "react";
import { DropTargetHookSpec, useDragDropManager, XYCoord } from "react-dnd";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { overGroupState } from "./overGroupState";
import { DND_TYPE } from "./useExplorerDnd";

export interface DragPreviewProps {
    items?: Item[];
}

const ref = createRef<HTMLElement>();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
(ref as MutableRefObject<HTMLElement>).current = document.getElementById("root")!;

const tagOffset = 20;

export const DragPreview: FC<DragPreviewProps> = () => {
    //const [altKey] = useKeyPress((event) => event.key === "Alt" || event.altKey);
    const [offset, setOffset] = useState<XYCoord | null>(null);

    const dragDropManager = useDragDropManager();

    const forceUpdate = useForceUpdate();

    const monitor = dragDropManager.getMonitor();
    const registry = dragDropManager.getRegistry();

    const dragItemType = monitor?.getItemType();
    const dragItems = monitor?.getItem() as ListItem[];

    const targetId = monitor.getTargetIds().at(-1);

    const target = targetId ? registry.getTarget(targetId) : undefined;
    const targetSpec = (target as any)?.spec as DropTargetHookSpec<unknown, unknown, unknown>;
    const group = targetSpec?.options as ListItem;

    //const [dragItems, setDragItems] = useState<ListItem[] | undefined>(undefined);

    const [overGroup, setOverGroup] = useRecoilState(overGroupState);

    useEffect(() => {
        if (monitor.canDropOnTarget(targetId)) {
            setOverGroup(group);
        } else {
            setOverGroup(undefined);
        }
    }, [dragItemType, dragItems, group, monitor, setOverGroup, targetId]);

    const handleEvent = useCallback(() => {
        forceUpdate();
    }, [forceUpdate]);

    const handleOffset = useCallback(() => {
        const offset = monitor.getClientOffset();
        setOffset(offset);
    }, [monitor]);

    useEffect(() => {
        const unsubscribeState = dragDropManager.getMonitor().subscribeToStateChange(handleEvent);
        const unsubscribeOffset = dragDropManager.getMonitor().subscribeToOffsetChange(handleOffset);

        return () => {
            unsubscribeState();
            unsubscribeOffset();
        };
    }, [dragDropManager, handleEvent, handleOffset]);

    if (dragItems && ref.current && offset) {
        return createPortal(
            <Tag className="absolute" style={{ left: offset.x + tagOffset, top: offset.y + tagOffset }}>
                {/* {overGroup ? altKey ? <span>Copy </span> : <span>Move </span> : null} */}
                {dragItemType === DND_TYPE ? (
                    dragItems.length > 1 ? (
                        <span>{dragItems.length} items</span>
                    ) : (
                        <span>{dragItems?.[0]?.name}</span>
                    )
                ) : null}
                {overGroup ? <span> to {overGroup.name}</span> : null}
            </Tag>,
            ref.current,
        );
    }

    return null;
};
