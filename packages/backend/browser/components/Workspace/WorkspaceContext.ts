import { createContext } from "react";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";

export const WorkspaceContext = createContext<WorkspaceStore>(null);
