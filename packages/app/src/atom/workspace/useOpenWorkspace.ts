import { backend } from "messaging";
import { WorkspaceId } from "models";
import { useRecoilCallback } from "recoil";
import { storeServices } from "../storeServices";
import { workspaceState } from "./workspace";

export const useOpenWorkspace = () =>
    useRecoilCallback(
        ({ set }) =>
            async (id: WorkspaceId) => {
                const workspace = await storeServices.dispatcher.call(backend.workspace.open, id);
                set(workspaceState, workspace);
            },
        [],
    );
