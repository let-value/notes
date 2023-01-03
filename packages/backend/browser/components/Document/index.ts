import { FC } from "react";
import { FileProps } from "../Workspace/File";
import { Markdown } from "./Markdown/Markdown";

export const fileComponent: Record<string, FC<FileProps>> = {
    markdown: Markdown,
};
