import { Workspace } from "@/domain";
import { backend, matchQuery, mediator } from "@/messaging";
import { concatMap, firstValueFrom } from "rxjs";
import { database } from "../db/database";

mediator.pipe(matchQuery(backend.workspaces)).subscribe(async (query) => {
    const workspaces = await firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").getAll$()),
        ),
    );
    await backend.workspaces.respond(query, workspaces);
});
