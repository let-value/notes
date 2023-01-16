import { makeAutoObservable } from "mobx";
import { BehaviorSubject } from "rxjs";
import { MenuItem } from "../MenuItem";

export const showSidebarState = new BehaviorSubject(true);

export class ReloadMenu implements MenuItem {
    label = "Reload";
    type = "normal" as const;
    hotkey = { combo: "Ctrl+R" };
    constructor() {
        makeAutoObservable(this);
    }

    async handler() {
        location.reload();
    }
}
