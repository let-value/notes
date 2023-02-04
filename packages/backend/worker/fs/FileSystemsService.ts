import { ContextGetter } from "iti/dist/src/_utils";
import { FileProvider, Workspace } from "models";
import { FileSystemProvider } from "./FileSystemProvider";
import { GDriveFileSystemService } from "./gdrive/GDriveFileSystemService";

export const fileSystemsService = (
    services: ContextGetter<
        {
            fs: () => FileSystemProvider;
        } & GDriveFileSystemService
    >,
) => ({
    fileSystems: () => ({
        async get(provider: FileProvider, workspace?: Workspace) {
            switch (provider) {
                case FileProvider.GDrive:
                    return services.gdriveFactory(workspace);
                default:
                    return services.fs;
            }
        },
    }),
});
