import { AnnotationIcon, Button, FolderCloseIcon, Menu, Popover, Position } from "evergreen-ui";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { useOpenDirectory } from "./atom/workspace/useOpenDirectory";
import { useOpenWorkspace } from "./atom/workspace/useOpenWorkspace";
import { directorySelector, fileState, useSelectFile } from "./atom/workspace/workspace";
import { workspacesSelector } from "./atom/workspaces/workspacesSelector";

export function Directory() {
    const workspaces = useRecoilValueLoadable(workspacesSelector);
    const directory = useRecoilValue(directorySelector);
    const file = useRecoilValue(fileState);

    const handleOpen = useOpenDirectory();
    const handleRequestPermission = useOpenWorkspace();
    const handleSelect = useSelectFile();

    return (
        <>
            <Button onClick={handleOpen}>Open directory</Button>
            {workspaces.state === "hasValue" && (
                <Popover
                    position={Position.BOTTOM_LEFT}
                    content={
                        <Menu>
                            {workspaces.contents.map((item) => (
                                <Menu.Item key={item.id} onSelect={() => handleRequestPermission(item.id)}>
                                    {item.name}
                                </Menu.Item>
                            ))}
                        </Menu>
                    }
                >
                    <Button>Open prev</Button>
                </Popover>
            )}
            <Menu>
                {directory?.map((item, index) => (
                    <Menu.Item
                        key={index}
                        icon={item.kind === "directory" ? FolderCloseIcon : AnnotationIcon}
                        aria-checked={item === file}
                        onSelect={() => handleSelect(item)}
                    >
                        {item.name}
                    </Menu.Item>
                ))}
            </Menu>
        </>
    );
}
