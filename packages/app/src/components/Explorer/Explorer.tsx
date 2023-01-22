import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    pointerWithin,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { FC } from "react";
import { DragPreview } from "./Dnd/DragPreview";
import { ExplorerList } from "./ExplorerList";
import { ExplorerTitle } from "./ExplorerTitle";

export const Explorer: FC = () => {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor);
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    return (
        <DndContext collisionDetection={pointerWithin} sensors={sensors}>
            <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
                <ExplorerTitle />
                <ExplorerList />
                <DragPreview />
            </div>
        </DndContext>
    );
};
