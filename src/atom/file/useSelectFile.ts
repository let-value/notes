import { useRecoilCallback } from "recoil";
import { File } from "../../domain/File";
import { fileState } from "./fileState";

export const useSelectFile = () =>
    useRecoilCallback(
        ({ set }) =>
            async (file: File) => {
                if (file.handle.kind !== "file") {
                    return;
                }

                set(fileState, file);
            },
        [],
    );
