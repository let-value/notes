import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import { Query } from "messaging";

export const openDialog = new Query<OpenDialogReturnValue, OpenDialogOptions>("openDialog");
