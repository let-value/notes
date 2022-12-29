import { Item } from "@/domain";
import { useRecoilCallback } from "recoil";
import { fileState } from "./fileState";

export const useSelectFile = () =>
    useRecoilCallback(
        ({ set }) =>
            async (item: Item) => {
                if (item.isDirectory) {
                    return;
                }

                set(fileState, item);
            },
        [],
    );
