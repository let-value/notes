import { backend, ReadFileQuery } from "messaging";
import { CallbackInterface } from "recoil";
import { context } from "../storeServices";
import { fileChangesState } from "./fileChangesState";

export const saveFile =
    ({ workspaceId, path }: ReadFileQuery) =>
    async ({ set, snapshot }: CallbackInterface) => {
        if (!workspaceId || !path) {
            return undefined;
        }

        const changesState = fileChangesState(path);
        const changes = await snapshot.getPromise(changesState);

        if (!changes) {
            return;
        }

        const { content, version } = changes;

        await context.dispatcher.call(backend.workspace.file.save, { workspaceId, path, content });

        set(changesState, (prev = {}) => ({ ...prev, savedVersion: version }));
    };
