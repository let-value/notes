import { atom, selector } from "recoil";

import { backend } from "messaging";
import { createQueryEffect } from "./createQueryEffect";
import { context } from "./storeServices";

export const workerState = atom<string>({
    key: "worker",
    default: selector({
        key: "worker/initial",
        get: () => {
            return context.dispatcher.call(backend.leader, undefined);
        },
    }),
    effects: [createQueryEffect(backend.leader)],
});
