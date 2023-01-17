import { backend, matchQuery } from "messaging";
import { container } from "../container";

const id = container.get("id");
const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(backend.leader)).subscribe((query) => {
    dispatcher.send(backend.leader.response(id, query));
});
