import { ListItem } from "@/atom/workspace";
import { atom } from "recoil";

export const overGroupState = atom<ListItem | undefined>({
    key: "explorer/dnd/group",
    default: undefined,
});
