import { makeAutoObservable } from "mobx";
import { MenuItem } from "../MenuItem";
import { ShowSidePanel } from "./ShowSidePanel";

export class ViewMenu implements MenuItem {
    type = "submenu" as const;
    label = "View";
    showSidePanel = new ShowSidePanel();
    constructor() {
        makeAutoObservable(this);
    }
    get items(): MenuItem[] {
        return [this.showSidePanel];
    }
}
