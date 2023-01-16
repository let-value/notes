import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import { matchQuery, Query } from "messaging";
import { container } from "../container";

export const openDialog = new Query<OpenDialogReturnValue, OpenDialogOptions>("openDialog");

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(openDialog)).subscribe(async (query) => {
    const response = (await window.promiseIpc.send("openDialog", query.payload)) as OpenDialogReturnValue;
    await dispatcher.send(openDialog.response(response, query));
});
