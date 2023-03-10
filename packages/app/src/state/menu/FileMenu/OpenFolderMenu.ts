import { setRecoil } from "@/atom/tunnel";
import { workspaceState } from "@/atom/workspace";
import { backend } from "messaging";
import { FileProvider } from "models";
import { context } from "../mainMenuService";
import { MenuItem } from "../MenuItem";

export class OpenFolderMenu implements MenuItem {
    label = "Open folder";
    type = "normal" as const;
    async handler() {
        const workspace = await context.dispatcher.call(backend.workspace.openDirectory, FileProvider.Local);
        setRecoil(workspaceState, workspace);
    }
}
