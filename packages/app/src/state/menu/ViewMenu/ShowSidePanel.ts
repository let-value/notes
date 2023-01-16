import { makeAutoObservable, runInAction } from "mobx";
import { BehaviorSubject } from "rxjs";
import { MenuItem } from "../MenuItem";

export const showSidebarState = new BehaviorSubject(true);

export class ShowSidePanel implements MenuItem {
    label = "Show Side Panel";
    type = "checkbox" as const;
    hotkey = {
        combo: "Ctrl+B",
    };
    value = true;
    constructor() {
        makeAutoObservable(this);
        showSidebarState.subscribe((value) =>
            runInAction(() => {
                this.value = value;
            }),
        );
    }

    get checked() {
        return this.value;
    }

    async handler() {
        showSidebarState.next(!this.value);
    }
}
