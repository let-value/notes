import { container } from "@/container";
import { backend } from "messaging";
import { WorkspaceId } from "models";
import { useRecoilCallback } from "recoil";
import { workspaceState } from "./workspace";

const dispatcher = container.get("dispatcher");

export const useOpenWorkspace = () =>
    useRecoilCallback(
        ({ set }) =>
            async (id: WorkspaceId) => {
                const workspace = await dispatcher.call(backend.workspace.open, id);
                set(workspaceState, workspace);
            },
        [],
    );
