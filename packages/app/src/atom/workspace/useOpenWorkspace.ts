import { useRecoilCallback } from "recoil";
import { WorkspaceId } from "../../domain";
import { backend } from "../../messaging";
import { workspaceState } from "./workspace";

export const useOpenWorkspace = () =>
    useRecoilCallback(
        ({ set }) =>
            async (id: WorkspaceId) => {
                const workspace = await backend.workspace.open.call(id);
                set(workspaceState, workspace);
            },
        [],
    );
