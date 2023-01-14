import { container } from "app/src/container";
import { workerElectronBackend } from "./backend";

container.upsert(workerElectronBackend);
await import("./controllers");
await import("app/src/main");
