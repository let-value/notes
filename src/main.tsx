import { defaultTheme, ThemeProvider } from "evergreen-ui";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import "./backend/local/setLocalBackend";
import "./features";
import "./index.css";
import { WorkerProvider } from "./WorkerProvider";
import "./workers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
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
        </Suspense>
    </React.StrictMode>,
);
