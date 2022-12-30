import { BroadcastMessage, frontend } from "@/messaging";
import { WorkspaceStore } from "./WorkspaceStore";

export class WorkspacePermissionHelper {
    constructor(private store: WorkspaceStore) {}

    async check(query?: BroadcastMessage) {
        const permission = await this.store.workspace.handle.queryPermission({ mode: "readwrite" });
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
        const newPermission = await frontend.requestPermission.call(
            this.store.workspace.handle,
            undefined,
            query?.senderId,
        );

        if (newPermission !== "granted") {
            throw new Error("Permission denied");
        }

        return newPermission;
    }
}
