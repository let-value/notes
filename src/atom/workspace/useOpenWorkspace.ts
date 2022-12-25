import { useRecoilCallback } from "recoil";
import { WorkspaceId } from "../../domain/DirectoryHandle";
import { workspaceLookupSelector } from "../workspaces/workspacesSelector";
import { mode } from "./DirectoryPermissionMode";
import { workspaceState } from "./workspace";

export const useOpenWorkspace = () =>
    useRecoilCallback(
        ({ snapshot, set }) =>
            async (id: WorkspaceId) => {
                const workspaces = await snapshot.getPromise(workspaceLookupSelector);
                const workspace = workspaces.get(id);

                if (!workspace) {
                    return;
                }

                const permission = await workspace.handle.requestPermission({ mode });
                if (permission == "granted") {
                    set(workspaceState, workspace);
                }
            },
        [],
    );
