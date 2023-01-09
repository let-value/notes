import { container } from "backend-worker/container";
import { backend } from "messaging";

const id = container.get("id");

export function setTabId(tabId: string) {
    container.upsert({ tabId });
}

await import("backend-worker/features");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
