import { MainMenu } from "app/src/state/menu/MainMenu";
import type { ContextGetter } from "iti/dist/src/_utils";
import { autorun } from "mobx";
import { ElectronMainMenu } from "./ElectronMainMenu";

export const electronMainMenuService = (services: ContextGetter<{ mainMenu: () => MainMenu }>) => {
    return {
        electronMainMenu: () => {
            console.trace("electronMainMenuService.electronMainMenu");

            const mainMenu = new ElectronMainMenu(services.mainMenu);
            const dispose = autorun(() => {
                JSON.stringify(mainMenu);
                mainMenu.update();
            }, {});

            return {
                mainMenu,
                dispose,
            };
        },
    };
};
