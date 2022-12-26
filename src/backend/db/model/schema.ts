import { appSchema } from "@nozbe/watermelondb";
import { createTable } from "./createTable";
import { WorkspaceModel } from "./models";

export default appSchema({
    version: 1,
    tables: [
        createTable<WorkspaceModel>({
            name: WorkspaceModel.table,
            columns: [
                { name: "name", type: "string" },
                { name: "handle", type: "string" },
                { name: "createdAt", type: "number" },
                { name: "updatedAt", type: "number" },
            ],
        }),
    ],
});
