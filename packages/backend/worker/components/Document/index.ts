import { FC } from "react";
import { FileComponentProps } from "./FileComponentProps";
import { Markdown } from "./Markdown/Markdown";

export const fileComponent: Record<string, FC<FileComponentProps>> = {
    markdown: Markdown,
};
