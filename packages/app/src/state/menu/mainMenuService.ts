import { MainMenu } from "./MainMenu";
import { MenuContext } from "./MenuContext";

export let context: MenuContext;

export const mainMenuService = (services: MenuContext) => {
    context = services;

    return {
        mainMenu: () => {
            console.trace("mainMenuService.mainMenu");
            return new MainMenu();
        },
    };
};
