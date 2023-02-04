import { observeRecoilLoadable, setRecoil } from "@/atom/tunnel";
import { workspaceState } from "@/atom/workspace";
import { workspacesSelector } from "@/atom/workspaces";
import { backend } from "messaging";
import { makeAutoObservable, runInAction } from "mobx";
import { Workspace, WorkspaceId } from "models";

import { context } from "../mainMenuService";
import { MenuItem } from "../MenuItem";

export class OpenRecentMenu implements MenuItem {
    label = "Open recent";
    type = "submenu" as const;
    workspaces?: Workspace[] = undefined;
    constructor() {
        makeAutoObservable(this);
        observeRecoilLoadable(workspacesSelector).then((pipe) => {
            pipe.subscribe((workspaces) =>
                runInAction(() => {
                    console.log("workspaces", workspaces);
                    this.workspaces = workspaces;
                }),
            );
        });
    }

    async itemHandler(workspaceId: WorkspaceId) {
        const workspace = await context.dispatcher.call(backend.workspace.open, workspaceId);
        setRecoil(workspaceState, workspace);
    }

    get items() {
        return this.workspaces?.map(
            (workspace): MenuItem => ({
                type: "normal",
                label: `${workspace.name} (${workspace.provider})`,
                handler: () => this.itemHandler(workspace.id),
            }),
        );
    }
}
