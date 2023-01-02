import { defaultTheme, ThemeProvider } from "evergreen-ui";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import "./backend/local/setLocalBackend";
import "./features";
import "./index.css";
import "./monacoSetup";
import { WorkerProvider } from "./WorkerProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Suspense>
        <RecoilRoot>
            <ThemeProvider value={defaultTheme}>
                <Suspense>
                    <WorkerProvider>
                        <App />
                    </WorkerProvider>
                </Suspense>
            </ThemeProvider>
        </RecoilRoot>
    </Suspense>,
);