import { Pane } from "evergreen-ui";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { fileState } from "./atom/file/fileState";
import { workerState } from "./atom/workerState";
import { Editor } from "./components/Editor/Editor";
import { Directory } from "./Directory";

export function App() {
    const worker = useRecoilValueLoadable(workerState);
    const file = useRecoilValue(fileState);

    if (worker.state != "hasValue") {
        return <div>loading</div>;
    }

    return (
        <Pane display="flex" padding={16} height="100%">
            <Pane width="30%">
                <Directory />
            </Pane>
            <Pane flex={1}>{file && <Editor file={file} />}</Pane>
        </Pane>
    );
}
