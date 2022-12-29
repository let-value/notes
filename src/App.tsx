import { Pane } from "evergreen-ui";
import { Suspense } from "react";
import { Directory } from "./components/Directory";
import { Document } from "./components/Document/Document";

export function App() {
    return (
        <Pane display="flex" padding={16} height="100%">
            <Pane height="100%" width="30%">
                <Directory />
            </Pane>
            <Pane height="100%" width="70%">
                <Suspense>
                    <Document />
                </Suspense>
            </Pane>
        </Pane>
    );
}
