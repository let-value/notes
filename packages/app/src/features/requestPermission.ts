import { frontend, matchQuery, mediator } from "messaging";

mediator.pipe(matchQuery(frontend.requestPermission)).subscribe(async (query) => {
    const permission = await query.payload.requestPermission({ mode: "read" });
    await frontend.requestPermission.respond(query, permission);
});
