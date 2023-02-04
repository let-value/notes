import { MenuItem } from "../MenuItem";
import { OpenGDriveMenu } from "./OpenGDriveMenu";

export class OpenRemoteMenu implements MenuItem {
    label = "Open remote";
    type = "submenu" as const;
    openGDrive = new OpenGDriveMenu();

    get items(): MenuItem[] {
        return [{ type: "normal", disabled: true, label: "Cloud" }, this.openGDrive];
    }
}
