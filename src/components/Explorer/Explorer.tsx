import { directoriesState } from "@/atom/workspace/workspace";
import { AnnotationIcon, FolderCloseIcon, Menu, Pane, Spinner } from "evergreen-ui";
import { FC } from "react";
import { useRecoilValueLoadable } from "recoil";
import { Workspace } from "../../domain/Workspace";

interface ExplorerProps {
    workspace: Workspace | undefined;
}

export const Explorer: FC<ExplorerProps> = ({ workspace }) => {
    const tree = useRecoilValueLoadable(directoriesState(workspace?.id ?? ""));

    if (!workspace) {
        return null;
    }

    console.log(tree.contents);

    return (
        <Pane height="100%" width="100%">
            <Menu>
                {tree.state === "loading" && <Spinner />}
                {tree.state === "hasValue" &&
                    tree.contents.map((item, index) => (
                        <Menu.Item key={index} icon={item.isDirectory ? FolderCloseIcon : AnnotationIcon}>
                            {item.name}
                        </Menu.Item>
                    ))}
            </Menu>
        </Pane>
    );
};
