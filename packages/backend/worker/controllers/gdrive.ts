import { backend, matchQuery } from "messaging";
import { FileProvider } from "models";
import { container } from "../container";
import { GDriveFileSystemProvider } from "../fs/gdrive/GDriveFileSystemProvider";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");
const fileSystems = container.get("fileSystems");

mediator.pipe(matchQuery(backend.gdrive.list)).subscribe(async (query) => {
    try {
        const { directory, user } = query.payload;
        const fs = (await fileSystems.get(FileProvider.GDrive)) as GDriveFileSystemProvider;
        fs.api.setUser(user);
        const list = await fs.list(directory);
        await dispatcher.send(backend.gdrive.list.response(list, query));
    } catch (error) {
        await dispatcher.send(backend.gdrive.list.error(error, query));
    }
});
