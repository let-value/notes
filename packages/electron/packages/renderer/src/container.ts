import { container as original } from "app/src/container";
import { workerElectronBackend } from "./backend";
import { electronMainMenuService } from "./mainMenu/mainMenuService";

export const container = original.upsert(workerElectronBackend).add(electronMainMenuService);
