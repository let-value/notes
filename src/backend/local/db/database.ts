import { ReactiveIDBDatabase } from "@creasource/reactive-idb";
import { shareReplay } from "rxjs";
import { schema } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
self.window = self;

export const database = ReactiveIDBDatabase.create({ name: "reactiveDatabase", schema: [schema] }).pipe(shareReplay(1));
