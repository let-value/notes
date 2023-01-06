import { backend } from "messaging";
import { useRecoilCallback } from "recoil";
import { storeServices } from "../storeServices";
import { workspaceState } from "./workspace";

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set }) =>
            async () => {
                const workspace = await storeServices.dispatcher.call(backend.workspace.openDirectory, undefined);
                set(workspaceState, workspace);
            },
        [],
    );
