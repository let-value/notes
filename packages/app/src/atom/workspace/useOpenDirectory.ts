import { useRecoilCallback } from "recoil";
import { backend } from "../../messaging";
import { workspaceState } from "./workspace";

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set }) =>
            async () => {
                const workspace = await backend.workspace.openDirectory.call(undefined);
                set(workspaceState, workspace);
            },
        [],
    );
