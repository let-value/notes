import { makeAutoObservable } from "mobx";
import { MenuItem } from "../MenuItem";
import { OpenFolderMenu } from "./OpenFolderMenu";
import { OpenRecentMenu } from "./OpenRecentMenu";
import { OpenRemoteMenu } from "./OpenRemoteMenu";
import { SaveFileMenu } from "./SaveFileMenu";

export class FileMenu implements MenuItem {
    label = "File";
    type = "submenu" as const;
    openFolder = new OpenFolderMenu();
    openRemote = new OpenRemoteMenu();
    openRecent = new OpenRecentMenu();
    saveFile = new SaveFileMenu();
    constructor() {
        makeAutoObservable(this);
    }
    get items(): MenuItem[] {
        return [this.openFolder, this.openRemote, this.openRecent, { type: "separator" }, this.saveFile];
    }
}
