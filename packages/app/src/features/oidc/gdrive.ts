import { container } from "@/container";
import { frontend, matchQuery } from "messaging";
import { User } from "oidc-client-ts";
import { gdriveManager } from "./gdriveManager";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(frontend.oidc.gdrive)).subscribe(async (query) => {
    let user: User | null = null;
    if (query.payload) {
        await gdriveManager.storeUser(new User(query.payload));
        user = await gdriveManager.signinSilent();
    }

    const response = user ?? (await gdriveManager.signinPopup());

    await gdriveManager.removeUser();

    await dispatcher.send(frontend.oidc.gdrive.response(response, query));
});
