import { createContainer } from "iti";
import { createDispatcherService, createMessagingService } from "messaging";
import { browserBackend } from "./backend";
import { editorMetaService } from "./editor/services/editorMetaService";
import { modelToEditorService } from "./editor/services/modelToEditorService";
import { tokensService } from "./editor/services/tokensService";
import { id } from "./tabId";

export const container = createContainer()
    .add({ id })
    .add(browserBackend)
    .add(createMessagingService)
    .add(createDispatcherService)
    .add(editorMetaService)
    .add(modelToEditorService)
    .add(tokensService);
