import { isFileHasChanges } from "@/atom/file";
import { activePanelParams$ } from "@/atom/panels/editorsDock";
import { observeRecoilLoadable, setRecoil } from "@/atom/tunnel";
import { workspaceState } from "@/atom/workspace";
import { backend } from "messaging";
import { makeAutoObservable, runInAction } from "mobx";
import { Item } from "models";
import { filter, map, mergeMap, tap } from "rxjs";
import { context } from "../mainMenuService";
import { MenuItem } from "../MenuItem";

export class SaveFileMenu implements MenuItem {
    label = "Save";
    type = "normal" as const;
    item?: Item<false>;
    hasChanges?: boolean;

    constructor() {
        makeAutoObservable(this);
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
                map((x) => (x.state === "hasValue" ? x.contents : false)),
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
        const workspace = await context.dispatcher.call(backend.workspace.openDirectory, undefined);
        setRecoil(workspaceState, workspace);
    }
}
