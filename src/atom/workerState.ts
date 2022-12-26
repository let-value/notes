import { atom, selector } from "recoil";
import { call } from "../backend/api";
import { methods } from "../backend/methods";
import { createBroadcastEffect } from "./createBroadcastEffect";

export const workerState = atom<string>({
    key: "worker",
    default: selector({
        key: "worker/initial",
        get: async () => {
            return await call(methods.worker, undefined);
        },
    }),
    effects: [createBroadcastEffect(methods.worker)],
});
