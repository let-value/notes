import { createContext } from "react";
import { TreeNode } from "./TreeNode";

export const TreeContext = createContext<TreeNode>(null);
