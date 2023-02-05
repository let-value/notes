import { CellValue } from "hyperformula";
import { backend, Query, ViewQuery } from "messaging";
import { atomFamily, selectorFamily } from "recoil";
import { createQueryEffect } from "../createQueryEffect";
import { context } from "../storeServices";

export const databaseViewState = atomFamily({
    key: "database/view",
    default: selectorFamily({
        key: "database/view/initial",
        get: (query: Readonly<Partial<ViewQuery>>) => async () => {
            if (!query.workspaceId || !query.path || !query.view) {
                return undefined;
            }

            try {
                return await context.dispatcher.call(backend.workspace.database.view, query as ViewQuery);
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
    }),
    effects: (query: Readonly<ViewQuery>) => [
        createQueryEffect(
            backend.workspace.database.view as Query<CellValue[][] | undefined, ViewQuery, ViewQuery>,
            (response) =>
                response.meta?.path === query.path &&
                response.meta?.workspaceId === query.workspaceId &&
                response.meta?.view === query.view,
        ),
    ],
});
