import { ContextGetter } from "iti/dist/src/_utils";
import { DispatcherService } from "messaging";
import { Workspace } from "models";
import { FileSystemProvider } from "../FileSystemProvider";
import { GDriveFileSystemProvider } from "./GDriveFileSystemProvider";

export const gdriveFileSystemService = (
    services: ContextGetter<{
        dispatcher: () => DispatcherService;
    }>,
) => ({
    gdriveFactory:
        () =>
        (workspace?: Workspace): FileSystemProvider =>
            new GDriveFileSystemProvider(services.dispatcher, workspace),
});

export type GDriveFileSystemService = ReturnType<typeof gdriveFileSystemService>;
export type GDriveFileSystemServiceFactory = ReturnType<GDriveFileSystemService["gdriveFactory"]>;
