import { ReactiveIDBDatabase } from "@creasource/reactive-idb";
import { shareReplay } from "rxjs";
import { schema } from "./schema";

export const database = ReactiveIDBDatabase.create({ name: "electronDatabase", schema: [schema] }).pipe(shareReplay(1));
