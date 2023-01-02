import { ReactiveIDBDatabase } from "@creasource/reactive-idb";
import { shareReplay } from "rxjs";
import { schema } from "./schema";

export const database = ReactiveIDBDatabase.create({ name: "reactiveDatabase", schema: [schema] }).pipe(shareReplay(1));
