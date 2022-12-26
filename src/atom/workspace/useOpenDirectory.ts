import { useRecoilCallback } from "recoil";
import { db } from "../../db";
import { backend } from "../../messaging";
import { workspacesSelector } from "../workspaces/workspacesSelector";
import { workspaceState } from "./workspace";

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set, refresh }) =>
            async () => {
                const workspace = await backend.workspace.openDirectory.call(undefined);
                await db.put("workspaces", workspace);
                refresh(workspacesSelector);
                set(workspaceState, workspace);
            },
        [],
    );
