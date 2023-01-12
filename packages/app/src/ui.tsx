import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { App } from "./App";
import { setStoreServices } from "./atom/storeServices";
import { container } from "./container";
import "./index.css";
import { WorkerProvider } from "./WorkerProvider";

async function updateStoreServices() {
    setStoreServices(await container.getContainerSet(["dispatcher", "mediator"]));
}

container.on("containerUpserted", updateStoreServices);
container.on("containerUpdated", updateStoreServices);
updateStoreServices();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Suspense>
        <RecoilRoot>
            <RecoilNexus />
            <Suspense>
                <WorkerProvider>
                    <App />
                </WorkerProvider>
            </Suspense>
        </RecoilRoot>
    </Suspense>,
);
