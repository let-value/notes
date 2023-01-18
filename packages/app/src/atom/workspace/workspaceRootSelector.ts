import { backend } from "messaging";
import { WorkspaceId } from "models";
import { selectorFamily } from "recoil";
import { context } from "../storeServices";

export const workspaceRootSelector = selectorFamily({
    key: "workspace/root",
    get: (workspaceId: WorkspaceId) => () => {
        return context.dispatcher.call(backend.workspace.root, workspaceId);
    },
});
