import { container } from "backend-worker/container";
import { backend, WorkerEventTarget } from "messaging";
import { NodeFileSystemProvider } from "./fs/NodeFileSystemProvider";

container.upsert({ eventTarget: () => new WorkerEventTarget(self) });
container.upsert({ fs: () => new NodeFileSystemProvider() });

const id = container.get("id");

await import("backend-worker/dom/setupDom");
await import("app/src/editor/setupMonaco");
await import("backend-worker/features");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
