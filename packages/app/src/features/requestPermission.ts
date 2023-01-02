import { container } from "@/container";
import { frontend, matchQuery } from "messaging";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(frontend.requestPermission)).subscribe(async (query) => {
    const permission = await query.payload.requestPermission({ mode: "read" });
    await dispatcher.send(frontend.requestPermission.response(permission, query));
});
