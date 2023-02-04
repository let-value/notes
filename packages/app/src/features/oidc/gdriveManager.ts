import { InMemoryWebStorage, UserManager, WebStorageStateStore } from "oidc-client-ts";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const client_secret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const redirect_uri = location.origin;
const popup_redirect_uri = `${location.origin}/oidc/gdrive`;

export const gdriveManager = new UserManager({
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
    authority: "https://accounts.google.com",
    client_id,
    client_secret,
    redirect_uri,
    response_type: "code",
    scope: encodeURI("https://www.googleapis.com/auth/drive"),
    popup_redirect_uri,
    extraQueryParams: {
        access_type: "offline",
    },
    popupWindowFeatures: {
        location: "no",
        toolbar: "no",
        width: 400,
        height: 500,
        left: 100,
        top: 100,
    },
});
