import { backend } from "messaging";
import { WorkspaceId } from "models";
import { useRecoilCallback } from "recoil";
import { context } from "../storeServices";
import { workspaceState } from "./workspace";

export const useOpenWorkspace = () =>
    useRecoilCallback(
        ({ set }) =>
            async (id: WorkspaceId) => {
                const workspace = await context.dispatcher.call(backend.workspace.open, id);
                set(workspaceState, workspace);
            },
        [],
    );
