import { databaseViewState } from "@/atom/database/databaseViewState";
import { DatabaseMeta, DatabaseView } from "models";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { EditorProps } from "../EditorProps";

export interface ViewProps extends EditorProps {
    meta: DatabaseMeta;
    view: DatabaseView;
}

export const View: FC<ViewProps> = ({ workspace, item, view }) => {
    const meta = useRecoilValue(databaseViewState({ workspaceId: workspace.id, path: item.path }));

    return <>{view.name}</>;
};
