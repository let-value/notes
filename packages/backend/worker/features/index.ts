export * from "./leader";
export * from "./workpaces";
export * from "./workspace";

import { rc } from "rclone";

console.log("core/version", rc("core/version", null));
