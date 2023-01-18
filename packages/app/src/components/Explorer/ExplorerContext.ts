import { Workspace } from "models";
import { createContext } from "react";

interface ExplorerContextProps {
    workspace: Workspace;
}

export const ExplorerContext = createContext<ExplorerContextProps>(null as never);
