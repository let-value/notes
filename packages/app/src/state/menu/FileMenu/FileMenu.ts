import { makeAutoObservable } from "mobx";
import { MenuItem } from "../MenuItem";
import { OpenFolderMenu } from "./OpenFolderMenu";
import { OpenRecentMenu } from "./OpenRecentMenu";
import { SaveFileMenu } from "./SaveFileMenu";

export class FileMenu implements MenuItem {
    label = "File";
    type = "submenu" as const;
    openFolder = new OpenFolderMenu();
    openRecent = new OpenRecentMenu();
    saveFile = new SaveFileMenu();
    constructor() {
        makeAutoObservable(this);
    }
    get items(): MenuItem[] {
        return [this.openFolder, this.openRecent, { type: "separator" }, this.saveFile];
    }
}
