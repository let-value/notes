import { Model } from "@nozbe/watermelondb";
import { date, json, readonly, text } from "@nozbe/watermelondb/decorators";
import { Workspace } from "../../../../domain";

export class WorkspaceModel extends Model implements Workspace {
    static table = "workspaces";

    //@ts-expect-error initialisation
    @text("name") name: string;

    //@ts-expect-error initialisation
    @json("handle", (x) => x) handle: FileSystemDirectoryHandle;

    //@ts-expect-error initialisation
    @readonly @date("createdAt") readonly createdAt: Date;

    //@ts-expect-error initialisation
    @readonly @date("updatedAt") readonly updatedAt: Date;

    toWorkspace(): Workspace {
        const { id, name, handle } = this;
        return { id, name, handle };
    }
}
