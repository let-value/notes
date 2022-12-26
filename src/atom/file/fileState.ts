import { atom } from "recoil";
import { File } from "../../domain/File";
import { fileSelectEffect } from "./fileSelectEffect";

export const fileState = atom<File | undefined>({
    key: "file",
    default: undefined,
    effects: [fileSelectEffect],
});
