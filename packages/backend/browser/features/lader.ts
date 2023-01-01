import { backend, matchQuery, mediator } from "messaging";

mediator.pipe(matchQuery(backend.leader)).subscribe((query) => {
    backend.leader.respond(query, id);
});
