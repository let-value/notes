import { makeAutoObservable } from "mobx";
import { FileMenu } from "./FileMenu/FileMenu";
import { MenuItem } from "./MenuItem";
import { ViewMenu } from "./ViewMenu/ViewMenu";

export class MainMenu implements MenuItem {
    type = "normal" as const;
    label = "Main";
    file = new FileMenu();
    view = new ViewMenu();
    constructor() {
        makeAutoObservable(this);
    }
    get items(): MenuItem[] {
        return [this.file, this.view];
    }
}
