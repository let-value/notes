import { frontend, matchQuery, mediator } from "../messaging";

mediator.pipe(matchQuery(frontend.pickDirectory)).subscribe(async (query) => {
    const handle = await window.showDirectoryPicker({ mode: query.payload });
    await frontend.pickDirectory.respond(query, handle);
});
