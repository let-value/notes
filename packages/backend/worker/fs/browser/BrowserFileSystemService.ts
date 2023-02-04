import type { ContextGetter } from "iti/dist/src/_utils";
import { DispatcherService } from "messaging";
import { FileSystemProvider } from "../FileSystemProvider";
import { BrowserFileSystemProvider } from "./BrowserFileSystemProvider";

export const browserFileSystemService = (
    services: ContextGetter<{
        dispatcher: () => DispatcherService;
    }>,
) => ({
    fs: (): FileSystemProvider => new BrowserFileSystemProvider(services.dispatcher),
});
