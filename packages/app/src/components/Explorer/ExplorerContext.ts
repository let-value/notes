import { Workspace } from "models";
import { createContext } from "react";
import { useMap } from "usehooks-ts";

interface ExplorerContextProps {
    workspace: Workspace;
    expandState: ReturnType<typeof useMap<string, boolean>>;
}

export const ExplorerContext = createContext<ExplorerContextProps>(null as never);
