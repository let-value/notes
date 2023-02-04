import { makeAutoObservable } from "mobx";
import { MenuItem } from "../MenuItem";
import { OpenFolderMenu } from "./OpenFolderMenu";
import { OpenGDriveMenu } from "./OpenGDriveMenu";
import { OpenRecentMenu } from "./OpenRecentMenu";
import { SaveFileMenu } from "./SaveFileMenu";

export class FileMenu implements MenuItem {
    label = "File";
    type = "submenu" as const;
    openFolder = new OpenFolderMenu();
    openGDrive = new OpenGDriveMenu();
    openRecent = new OpenRecentMenu();
    saveFile = new SaveFileMenu();
    constructor() {
        makeAutoObservable(this);
    }
    get items(): MenuItem[] {
        return [this.openFolder, this.openGDrive, this.openRecent, { type: "separator" }, this.saveFile];
    }
}
