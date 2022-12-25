import { useRecoilCallback } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db";
import { Workspace } from "../../domain/DirectoryHandle";
import { incrementFileNameIfExist } from "../../utils/incrementFileNameIfExist";
import { workspacesSelector } from "../workspaces/workspacesSelector";
import { mode } from "./DirectoryPermissionMode";
import { workspaceState } from "./workspace";

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set, snapshot, refresh }) =>
            async () => {
                const handle = await window.showDirectoryPicker({ mode });
                const workspaces = await snapshot.getPromise(workspacesSelector);

                let previousWorkspace: Workspace | undefined = undefined;
                for (const workspace of workspaces) {
                    if (await workspace.handle.isSameEntry(handle)) {
                        previousWorkspace = workspace;
                        break;
                    }
                }

                if (previousWorkspace) {
                    set(workspaceState, previousWorkspace);
                    return;
                }

                const workspaceNames = workspaces.map((workspace) => workspace.name);
                const id = uuidv4();
                const name = incrementFileNameIfExist(handle.name, workspaceNames);
                const workspace: Workspace = { id, name, handle };

                await db.put("workspaces", workspace);
                refresh(workspacesSelector);
                set(workspaceState, workspace);
            },
        [],
    );
