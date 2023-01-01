import { container } from "app/src/container";
import { electronBackend } from "./backend";

container.upsert(electronBackend);

import("app/src/main");
