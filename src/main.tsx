import { defaultTheme, ThemeProvider } from "evergreen-ui";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import "./index.css";
import "./monacoWorker";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <RecoilRoot>
                <ThemeProvider value={defaultTheme}>
                    <Suspense>
                        <App />
                    </Suspense>
                </ThemeProvider>
            </RecoilRoot>
        </Suspense>
    </React.StrictMode>,
);
