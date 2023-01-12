import { container } from "app/src/container";
import { workerElectronBackend } from "./backend";

container.upsert(workerElectronBackend);

container.get("eventTarget");

import("app/src/main");
