import { FromSchema } from "json-schema-to-ts";
import { databaseSchema } from "./database.schema";

export type DatabaseMeta = FromSchema<typeof databaseSchema>;

export type DatabaseView = DatabaseMeta["views"][number];
