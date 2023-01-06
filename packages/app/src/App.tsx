import { Pane } from "evergreen-ui";
import { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { fileState } from "./atom/file/fileState";
import { workspaceState } from "./atom/workspace/workspace";
import { Directory } from "./components/Directory";
import { Document } from "./components/Document/Document";
import { Explorer } from "./components/Explorer/Explorer";

export function App() {
    const workspace = useRecoilValue(workspaceState);
    const item = useRecoilValue(fileState);

    return (
        <Pane display="flex" padding={16} height="100%">
            <Pane height="100%" width="30%">
                <Pane display="flex" flexDirection="column" height="100%" width="100%" overflow="hidden">
                    <Directory />
                    {workspace && <Explorer workspace={workspace} />}
                </Pane>
            </Pane>
            <Pane height="100%" width="70%">
                <Suspense>{workspace && item && <Document workspace={workspace} item={item} />}</Suspense>
            </Pane>
        </Pane>
    );
}
