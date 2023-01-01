import { backend, matchQuery, mediator } from "messaging";
import { getWorkspaces } from "../db/repositories";

mediator.pipe(matchQuery(backend.workspaces)).subscribe(async (query) => {
    const workspaces = await getWorkspaces();
    await backend.workspaces.respond(query, workspaces);
});
