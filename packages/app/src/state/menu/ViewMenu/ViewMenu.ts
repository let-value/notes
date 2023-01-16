import { makeAutoObservable } from "mobx";
import { MenuItem } from "../MenuItem";
import { ReloadMenu } from "./ReloadMenu";
import { ShowSidePanel } from "./ShowSidePanel";

export class ViewMenu implements MenuItem {
    type = "submenu" as const;
    label = "View";
    showSidePanel = new ShowSidePanel();
    reload = new ReloadMenu();
    constructor() {
        makeAutoObservable(this);
    }
    get items(): MenuItem[] {
        return [this.showSidePanel, this.reload];
    }
}
