import { isFileHasChanges, saveFile } from "@/atom/file";
import { activePanelParams$ } from "@/atom/panels/editorsDock";
import { observeRecoilLoadable, recoilAction } from "@/atom/tunnel";
import { workspaceState } from "@/atom/workspace";
import { makeAutoObservable, runInAction } from "mobx";
import { Item, Workspace } from "models";
import { filter, map, mergeMap, tap } from "rxjs";
import { MenuItem } from "../MenuItem";

export class SaveFileMenu implements MenuItem {
    label = "Save";
    type = "normal" as const;
    hotkey = { allowInInput: true, combo: "Ctrl+S", preventDefault: true, stopPropagation: true };
    workspace?: Workspace = undefined;
    item?: Item<false> = undefined;
    hasChanges?: boolean = false;

    constructor() {
        makeAutoObservable(this);

        observeRecoilLoadable(workspaceState).then((workspace) =>
            workspace.subscribe((workspace) =>
                runInAction(() => {
                    this.workspace = workspace;
                }),
            ),
        );

        activePanelParams$
            .pipe(
                filter(Boolean),
                map((params) => params.item),
                tap((item) =>
                    runInAction(() => {
                        this.item = item;
                    }),
                ),
                mergeMap((item) => observeRecoilLoadable(isFileHasChanges(item.path))),
                mergeMap((x) => x),
            )
            .subscribe((hasChanges) =>
                runInAction(() => {
                    this.hasChanges = hasChanges;
                }),
            );
    }

    get disabled() {
        return !this.item || !this.hasChanges;
    }

    async handler() {
        if (!this.item || !this.workspace) {
            return;
        }
        recoilAction(saveFile({ workspaceId: this.workspace.id, path: this.item.path }));
    }
}
