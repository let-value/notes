import { backend } from "messaging";
import { useRecoilCallback } from "recoil";
import { context } from "../storeServices";
import { workspaceState } from "./workspace";

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set }) =>
            async () => {
                const workspace = await context.dispatcher.call(backend.workspace.openDirectory, undefined);
                set(workspaceState, workspace);
            },
        [],
    );
