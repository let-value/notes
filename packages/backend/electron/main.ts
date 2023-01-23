import { container as original } from "backend-worker/container";
import { backend, WorkerEventTarget } from "messaging";
import { nodeFileSystemService } from "./fs/NodeFileSystemService";

const container = original.upsert({ eventTarget: () => new WorkerEventTarget(self) }).upsert(nodeFileSystemService);

const id = container.get("id");

await import("app/src/editor/setupMonaco");
await import("backend-worker/controllers");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
