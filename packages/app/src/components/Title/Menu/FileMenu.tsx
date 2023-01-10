import { useOpenDirectory, useOpenWorkspace } from "@/atom/workspace";
import { workspacesSelector } from "@/atom/workspaces";
import { MenuItem2 } from "@blueprintjs/popover2";
import { useRecoilValueLoadable } from "recoil";

export const FileMenu = () => {
    const workspaces = useRecoilValueLoadable(workspacesSelector);
    const handleOpenDirectory = useOpenDirectory();
    const handleOpenWorkspace = useOpenWorkspace();

    return (
        <>
            <MenuItem2 text="Open folder" onClick={handleOpenDirectory} />
            {workspaces.state === "hasValue" && workspaces.contents.length > 0 && (
                <MenuItem2 text="Open recent">
                    {workspaces.contents.map((item) => (
                        <MenuItem2 key={item.id} onClick={() => handleOpenWorkspace(item.id)} text={item.name} />
                    ))}
                </MenuItem2>
            )}
        </>
    );
};

FileMenu.displayName = "File";
