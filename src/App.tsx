import { Pane } from "evergreen-ui";
import { useRecoilValue } from "recoil";
import { fileState } from "./atom/workspace/workspace";
import { Editor } from "./components/Editor/Editor";
import { Directory } from "./Directory";

export function App() {
    const file = useRecoilValue(fileState);

    return (
        <Pane display="flex" padding={16} height="100%">
            <Pane width="30%">
                <Directory />
            </Pane>
            <Pane flex={1}>{file && <Editor file={file} />}</Pane>
        </Pane>
    );
}
