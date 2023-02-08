import { databaseMetaState } from "@/atom/database/databaseMetaState";
import { Intent } from "@blueprintjs/core";
import { Column, EditableCell2, RowHeaderCellProps, Table2 } from "@blueprintjs/table";
import { FC, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { databaseViewState } from "../../../atom/database/databaseViewState";
import type { ViewProps } from "./View";

const RowHeader = (rowIndex: number) =>
    function RowHeaderCell({ children }: RowHeaderCellProps) {
        return <>{children}</>;
    };

export const TableView: FC<ViewProps> = ({ workspace, item, view }) => {
    const meta = useRecoilValue(databaseMetaState({ workspaceId: workspace.id, path: item.path }));
    const data = useRecoilValue(databaseViewState({ workspaceId: workspace.id, path: item.path, view: view.name }));

    const columns = Math.max(...(data ?? []).map((row) => row.length));

    const handleRenderCell = useCallback(
        (columnIndex: number, rowIndex: number) => {
            const cell = data?.[rowIndex]?.[columnIndex];

            const error = typeof cell === "object";
            const value = error ? cell?.value : cell;

            return <EditableCell2 value={value?.toString() ?? ""} intent={error ? Intent.DANGER : undefined} />;
        },
        [data],
    );

    if (!data) {
        return null;
    }

    return (
        <Table2
            enableColumnReordering
            enableRowReordering
            enableColumnInteractionBar
            enableRowHeader
            enableMultipleSelection
            numRows={data?.length}
            enableRowResizing={false}
        >
            {Array.from({ length: columns }).map((_, i) => (
                <Column
                    key={i}
                    name={columnNumberToExcelColumnName(i + 1)}
                    cellRenderer={handleRenderCell.bind(undefined, i)}
                />
            ))}
        </Table2>
    );
};

export function columnNumberToExcelColumnName(columnNumber: number) {
    let dividend = columnNumber;
    let columnName = "";
    let modulo;

    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
}
