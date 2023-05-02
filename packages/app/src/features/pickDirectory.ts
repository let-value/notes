import { container } from "@/container";
import { frontend, matchQuery } from "messaging";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(frontend.pickDirectory.local)).subscribe(async (query) => {
    const handle = await window.showDirectoryPicker({ mode: "read" });
    await dispatcher.send(frontend.pickDirectory.local.response(handle, query));
});
