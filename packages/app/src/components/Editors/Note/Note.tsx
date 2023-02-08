import { fileContentState } from "@/atom/file";
import { Markdown } from "@/components/Markdown/Markdown";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { EditorProps } from "../EditorProps";

export const Note: FC<EditorProps> = ({ workspace, item }) => {
    const content = useRecoilValue(fileContentState({ workspaceId: workspace?.id, path: item?.path }));

    if (!content) {
        return null;
    }

    return (
        <div className="prose max-w-none p-4 h-full overflow-auto">
            <Markdown>{content}</Markdown>
        </div>
    );
};
