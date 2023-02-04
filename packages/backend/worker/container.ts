import { createContainer } from "iti";
import { createDispatcherService, createMessagingService } from "messaging";
import { queueService } from "queue";
import { eventTargetService } from "./eventTargetService";
import { browserFileSystemService } from "./fs/browser/BrowserFileSystemService";
import { fileSystemsService } from "./fs/FileSystemsService";
import { gdriveFileSystemService } from "./fs/gdrive/GDriveFileSystemService";
import { id } from "./workerId";

export const container = createContainer()
    .add({ id, tabId: () => "" })
    .add(queueService)
    .add(eventTargetService)
    .add(createMessagingService)
    .add(createDispatcherService)
    .add(browserFileSystemService)
    .add(gdriveFileSystemService)
    .add(fileSystemsService);
