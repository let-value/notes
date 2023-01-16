import { HotkeysProvider } from "@blueprintjs/core";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import { atomService } from "./atom/storeServices";
import { RecoilTunnel } from "./atom/tunnel";
import { container } from "./container";
import "./index.css";
import { WorkerProvider } from "./WorkerProvider";

atomService(container as never);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Suspense>
        <RecoilRoot>
            <RecoilTunnel />
            <Suspense>
                <WorkerProvider>
                    <HotkeysProvider>
                        <App />
                    </HotkeysProvider>
                </WorkerProvider>
            </Suspense>
        </RecoilRoot>
    </Suspense>,
);
