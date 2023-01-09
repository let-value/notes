import { container } from "backend-worker/container";
import { backend, WorkerEventTarget } from "messaging";

container.upsert({ eventTarget: () => new WorkerEventTarget(self) });

const id = container.get("id");

await import("app/src/editor/setupMonaco");
await import("backend-worker/dom/setupDom");
await import("backend-worker/features");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
