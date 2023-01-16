import type { ContextGetter } from "iti/dist/src/_utils";
import { DispatcherService } from "messaging";

export type MenuContext = ContextGetter<{
    dispatcher: () => DispatcherService;
}>;
