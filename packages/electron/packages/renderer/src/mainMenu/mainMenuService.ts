import { mainMenuService, MenuContext } from "app/src/state/menu";
import { autorun } from "mobx";
import { ElectronMainMenu } from "./ElectronMainMenu";

export const electronMainMenuService = (services: MenuContext) => {
    return {
        mainMenu: () => {
            console.trace("electronMainMenuService.electronMainMenu");

            const mainMenu = mainMenuService(services).mainMenu();

            const electronMenu = new ElectronMainMenu(mainMenu);

            autorun(() => {
                const snapshot = JSON.stringify(electronMenu);
                electronMenu.update();
            }, {});

            return electronMenu;
        },
    };
};
