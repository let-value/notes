import { Database } from "@nozbe/watermelondb";
import { adapter } from "./adapter";
import { WorkspaceModel } from "./model/models";

export const database = new Database({
    adapter,
    modelClasses: [WorkspaceModel],
});
