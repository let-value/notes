import { AtomEffect } from "recoil";
import { matchResponse, mediator, Query } from "../messaging";

export const createQueryEffect =
    <T>(query: Query<T>): AtomEffect<T> =>
    ({ setSelf }) => {
        const subscription = mediator.pipe(matchResponse(query)).subscribe((event) => {
            setSelf(event.payload);
        });

        return () => {
            subscription.unsubscribe();
        };
    };
