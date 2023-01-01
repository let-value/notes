import { atom, selector } from "recoil";

import { backend } from "messaging";
import { createQueryEffect } from "./createQueryEffect";

export const workerState = atom<string>({
    key: "worker",
    default: selector({
        key: "worker/initial",
        get: async () => {
            return await backend.leader.call(undefined);
        },
    }),
    effects: [createQueryEffect(backend.leader)],
});
