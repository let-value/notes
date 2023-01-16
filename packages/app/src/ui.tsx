import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import { RecoilTunnel } from "./atom/tunnel";
import "./index.css";
import { WorkerProvider } from "./WorkerProvider";

// async function updateStoreServices() {
//     setStoreServices(await container.getContainerSet(["dispatcher", "mediator"]));
// }

// container.on("containerUpserted", updateStoreServices);
// container.on("containerUpdated", updateStoreServices);
// updateStoreServices();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Suspense>
        <RecoilRoot>
            <RecoilTunnel />
            <Suspense>
                <WorkerProvider>
                    <App />
                </WorkerProvider>
            </Suspense>
        </RecoilRoot>
    </Suspense>,
);
