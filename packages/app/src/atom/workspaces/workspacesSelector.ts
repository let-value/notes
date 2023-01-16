import { backend } from "messaging";
import { Workspace } from "models";
import { atom, selector } from "recoil";
import { createQueryEffect } from "../createQueryEffect";
import { context } from "../storeServices";

export const workspacesSelector = atom<Workspace[]>({
    key: "workspaces",
    default: selector({
        key: "workspaces/initial",
        get: async () => {
            return await context.dispatcher.call(backend.workspaces, undefined);
        },
    }),
    effects: [createQueryEffect(backend.workspaces)],
});
