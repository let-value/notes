import { FC } from "react";
import { DndContainer } from "./Dnd/DndContainer";
import { DragPreview } from "./Dnd/DragPreview";
import { ExplorerList } from "./ExplorerList";
import { ExplorerTitle } from "./ExplorerTitle";

export const Explorer: FC = () => {
    return (
        <DndContainer className="flex flex-col flex-1 h-full w-full overflow-hidden">
            <ExplorerTitle />
            <ExplorerList />
            <DragPreview />
        </DndContainer>
    );
};
