import { setRecoil } from "@/atom/tunnel";
import { workspaceState } from "@/atom/workspace";
import { backend } from "messaging";
import { FileProvider } from "models";
import { context } from "../mainMenuService";
import { MenuItem } from "../MenuItem";

export class OpenGDriveMenu implements MenuItem {
    label = "Open GDrive";
    type = "normal" as const;
    async handler() {
        const workspace = await context.dispatcher.call(backend.workspace.openDirectory, FileProvider.GDrive);
        setRecoil(workspaceState, workspace);
    }
}
