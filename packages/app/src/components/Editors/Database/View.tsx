import { DatabaseMeta, DatabaseView } from "models";
import { FC } from "react";
import { EditorProps } from "../EditorProps";
import { TableView } from "./TableView";

export interface ViewProps extends EditorProps {
    meta: DatabaseMeta;
    view: DatabaseView;
}

export const View: FC<ViewProps> = (props) => {
    return <TableView {...props} />;
};
