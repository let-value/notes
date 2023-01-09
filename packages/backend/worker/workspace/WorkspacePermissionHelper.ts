import { BroadcastMessage, frontend } from "messaging";
import { container } from "../container";
import { WorkspaceStore } from "./WorkspaceStore";

const queue = container.get("queue");
const dispatcher = container.get("dispatcher");

export class WorkspacePermissionHelper {
    constructor(private store: WorkspaceStore) {}

    async check(query?: BroadcastMessage) {
        const permission = await this.store.workspace.handle.queryPermission({ mode: "read" });
        if (permission === "denied") {
            throw new Error("Permission denied");
        }

        if (permission === "prompt") {
            const newPermission = await this.request(query);
            if (newPermission !== "granted") {
                throw new Error("Permission denied");
            }
            return newPermission;
        }

        return permission;
    }

    async request(query?: BroadcastMessage) {
        const taskId = `${this.store.workspace.id}/requestPermission`;
        const task = async () => {
            const newPermission = await dispatcher.call(
                frontend.requestPermission,
                this.store.workspace.handle,
                undefined,
                query?.senderId,
            );

            if (newPermission !== "granted") {
                throw new Error("Permission denied");
            }

            return newPermission;
        };

        return await queue.add(task, { priority: 4, type: taskId });
    }
}