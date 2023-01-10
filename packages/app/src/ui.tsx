import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { App } from "./App";
import "./index.css";
import { WorkerProvider } from "./WorkerProvider";

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
