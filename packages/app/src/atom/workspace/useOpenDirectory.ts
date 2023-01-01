import { container } from "@/container";
import { backend } from "messaging";
import { useRecoilCallback } from "recoil";
import { workspaceState } from "./workspace";

const dispatcher = container.get("dispatcher");

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set }) =>
            async () => {
                const workspace = await dispatcher.call(backend.workspace.openDirectory, undefined);
                set(workspaceState, workspace);
            },
        [],
    );
