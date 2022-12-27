import { Button, Menu, Popover, Position } from "evergreen-ui";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { useOpenDirectory } from "./atom/workspace/useOpenDirectory";
import { useOpenWorkspace } from "./atom/workspace/useOpenWorkspace";
import { workspaceState } from "./atom/workspace/workspace";
import { workspacesSelector } from "./atom/workspaces/workspacesSelector";
import { Explorer } from "./components/Explorer/Explorer";

export function Directory() {
    const workspaces = useRecoilValueLoadable(workspacesSelector);
    const workspace = useRecoilValue(workspaceState);

    console.log(workspace);

    const handleOpen = useOpenDirectory();
    const handleRequestPermission = useOpenWorkspace();

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
            {workspace && <Explorer workspace={workspace} />}
        </>
    );
}
