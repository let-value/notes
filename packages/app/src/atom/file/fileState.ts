import { Item } from "models";
import { atom } from "recoil";

export const fileState = atom<Item | undefined>({
    key: "file",
    default: undefined,
});
