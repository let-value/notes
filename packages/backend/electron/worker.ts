import { container } from "backend-browser/container";
import { backend, WorkerEventTarget } from "messaging";

container.upsert({ eventTarget: () => new WorkerEventTarget(self) });

const id = container.get("id");

await import("app/src/editor/setupMonaco");
await import("backend-browser/dom/setupDom");
await import("backend-browser/features");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
