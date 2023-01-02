import { Button, CaretDownIcon, Menu, Pane, Popover, Position } from "evergreen-ui";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { useOpenDirectory } from "../atom/workspace/useOpenDirectory";
import { useOpenWorkspace } from "../atom/workspace/useOpenWorkspace";
import { workspaceState } from "../atom/workspace/workspace";
import { workspacesSelector } from "../atom/workspaces/workspacesSelector";
import { Explorer } from "./Explorer/Explorer";

export function Directory() {
    const workspaces = useRecoilValueLoadable(workspacesSelector);
    const workspace = useRecoilValue(workspaceState);

    const handleOpen = useOpenDirectory();
    const handleRequestPermission = useOpenWorkspace();

    return (
        <Pane display="flex" flexDirection="column" height="100%" width="100%" overflow="hidden">
            <Pane>
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
                        <Button>
                            <CaretDownIcon />
                        </Button>
                    </Popover>
                )}
            </Pane>
            {workspace && <Explorer workspace={workspace} />}
        </Pane>
    );
}
