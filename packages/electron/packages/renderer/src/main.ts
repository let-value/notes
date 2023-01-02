import { container } from "app/src/container";
import { electronBackend } from "./backend";

container.upsert(electronBackend);

container.get("eventTarget");

import("app/src/main");
