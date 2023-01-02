import { atom, selector } from "recoil";

import { container } from "@/container";
import { backend } from "messaging";
import { createQueryEffect } from "./createQueryEffect";

const dispatcher = container.get("dispatcher");

export const workerState = atom<string>({
    key: "worker",
    default: selector({
        key: "worker/initial",
        get: async () => {
            return await dispatcher.call(backend.leader, undefined);
        },
    }),
    effects: [createQueryEffect(backend.leader)],
});
