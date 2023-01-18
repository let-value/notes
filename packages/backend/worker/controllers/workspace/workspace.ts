import { backend, matchQuery } from "messaging";

import { container } from "../../container";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");
const fs = container.get("fs");

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    try {
        const workspace = await fs.openWorkspace();
        await dispatcher.send(backend.workspace.openDirectory.response(workspace, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.openDirectory.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.open)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload);
        await dispatcher.send(backend.workspace.open.response(store.workspace, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.open.error(error, query));
    }
});
