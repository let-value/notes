import { FileSystemProvider } from "backend-worker/fs/FileSystemProvider";
import type { ContextGetter } from "iti/dist/src/_utils";
import { DispatcherService } from "messaging";
import { NodeFileSystemProvider } from "./NodeFileSystemProvider";

export const nodeFileSystemService = (
    services: ContextGetter<{
        dispatcher: () => DispatcherService;
    }>,
) => ({
    fs: (): FileSystemProvider => {
        return new NodeFileSystemProvider(services.dispatcher);
    },
});
