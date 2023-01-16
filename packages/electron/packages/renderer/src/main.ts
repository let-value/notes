import { container } from "app/src/container";
import { workerElectronBackend } from "./backend";
import { electronMainMenuService } from "./mainMenu/mainMenuService";

container.upsert(workerElectronBackend).add(electronMainMenuService);

await import("./controllers");
await import("app/src/main");
