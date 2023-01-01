import { container } from "backend-browser/container";
import { backend } from "messaging";

container.upsert({ eventTarget: () => self });

const id = container.get("id");

console.log("backend", id);

await import("backend-browser/dom/setupDom");
await import("backend-browser/features");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

console.log("response", response);

dispatcher.send(response);
