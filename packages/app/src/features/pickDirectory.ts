import { container } from "@/container";
import { frontend, matchQuery } from "messaging";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(frontend.pickDirectory)).subscribe(async (query) => {
    const handle = await window.showDirectoryPicker({ mode: "read" });
    await dispatcher.send(frontend.pickDirectory.response(handle, query));
});
