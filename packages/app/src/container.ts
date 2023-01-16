import { createContainer } from "iti";
import { createDispatcherService, createMessagingService } from "messaging";
import { atomService } from "./atom/storeServices";
import { browserBackend } from "./backend";
import { editorMetaService } from "./editor/services/editorMetaService";
import { modelToEditorService } from "./editor/services/modelToEditorService";
import { tokensService } from "./editor/services/tokensService";
import { mainMenuService } from "./state/menu/mainMenuService";
import { id } from "./tabId";

export const container = createContainer()
    .add({ id })
    .add(browserBackend)
    .add(createMessagingService)
    .add(createDispatcherService)
    .add(atomService)
    .add(mainMenuService)
    .add(editorMetaService)
    .add(modelToEditorService)
    .add(tokensService);
