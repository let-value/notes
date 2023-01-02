import { backend, matchQuery } from "messaging";
import { container } from "../container";
import { getWorkspaces } from "../db/repositories";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(backend.workspaces)).subscribe(async (query) => {
    const workspaces = await getWorkspaces();
    await dispatcher.send(backend.workspaces.response(workspaces, query));
});
