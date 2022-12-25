import { DBSchema, openDB } from "idb";
import { Workspace } from "./domain/DirectoryHandle";

interface DataBase extends DBSchema {
    workspaces: {
        key: string;
        value: Workspace;
        indexes: { byId: string; byName: string };
    };
}

export const db = await openDB<DataBase>("db", 1, {
    upgrade(db) {
        const workspaces = db.createObjectStore("workspaces", {
            keyPath: "id",
        });

        workspaces.createIndex("byId", "id");
        workspaces.createIndex("byName", "name");
    },
});
