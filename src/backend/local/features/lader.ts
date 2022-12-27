import { backend, matchQuery, mediator } from "@/messaging";
import { id } from "../../../tabId";

mediator.pipe(matchQuery(backend.leader)).subscribe((query) => {
    backend.leader.respond(query, id);
});
