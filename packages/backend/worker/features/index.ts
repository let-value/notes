export * from "./leader";
export * from "./workpaces";
export * from "./workspace";

import { rc, ready } from "rclone";

await ready;
try {
    console.log("core/version", rc("core/version", null));
} catch (e) {
    console.error(e);
}
