import { container } from "app/src/container";
import { workerElectronBackend } from "./backend";

container.upsert(workerElectronBackend);

import("app/src/main");
