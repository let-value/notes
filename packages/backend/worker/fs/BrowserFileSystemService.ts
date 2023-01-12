import { ContextGetter } from "iti/dist/src/_utils";
import { DispatcherService } from "messaging";
import { BrowserFileSystemProvider } from "./BrowserFileSystemProvider";
import { FileSystemProvider } from "./FileSystemProvider";

export const browserFileSystemService = (
    services: ContextGetter<{
        dispatcher: () => DispatcherService;
    }>,
) => ({
    fs: (): FileSystemProvider => new BrowserFileSystemProvider(services.dispatcher),
});
