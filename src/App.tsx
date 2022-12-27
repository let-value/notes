import { Pane } from "evergreen-ui";
import { Directory } from "./Directory";

export function App() {
    return (
        <Pane display="flex" padding={16} height="100%">
            <Directory />
        </Pane>
    );
}
