import type { OpenDialogReturnValue } from "electron";
import { matchQuery } from "messaging";
import { container } from "../../container";
import { openDialog } from "./query";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(openDialog)).subscribe(async (query) => {
    const response = (await window.promiseIpc.send("openDialog", query.payload)) as OpenDialogReturnValue;
    await dispatcher.send(openDialog.response(response, query));
});
