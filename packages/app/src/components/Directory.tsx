import { Button, CaretDownIcon, Menu, Pane, Popover, Position } from "evergreen-ui";
import { useRecoilValueLoadable } from "recoil";
import { useOpenDirectory } from "../atom/workspace/useOpenDirectory";
import { useOpenWorkspace } from "../atom/workspace/useOpenWorkspace";
import { workspacesSelector } from "../atom/workspaces/workspacesSelector";

export function Directory() {
    const workspaces = useRecoilValueLoadable(workspacesSelector);

    const handleOpen = useOpenDirectory();
    const handleRequestPermission = useOpenWorkspace();

    return (
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
    );
}
