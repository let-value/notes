import { backend, ReadFileQuery } from "messaging";
import { useRecoilCallback } from "recoil";
import { storeServices } from "../storeServices";
import { fileChangesState } from "./fileChangesState";

export const useSaveFile = () =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            async ({ workspaceId, path }: ReadFileQuery) => {
                if (!workspaceId || !path) {
                    return undefined;
                }

                const changesState = fileChangesState(path);
                const changes = await snapshot.getPromise(changesState);

                if (!changes) {
                    return;
                }

                const { content, version } = changes;

                await storeServices.dispatcher.call(backend.workspace.file.save, { workspaceId, path, content });

                set(changesState, (prev = {}) => ({ ...prev, savedVersion: version }));
            },
        [],
    );
