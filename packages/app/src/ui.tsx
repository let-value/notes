import { HotkeysProvider } from "@blueprintjs/core";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { RecoilTunnel } from "./atom/tunnel";
import { Oidc } from "./components/Oidc/Oidc";
import "./index.css";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="oidc/*" element={<Oidc />} />
            <Route
                path="/"
                element={
                    <Suspense>
                        <RecoilRoot>
                            <RecoilTunnel />

                            <HotkeysProvider>
                                <Suspense>
                                    <App />
                                </Suspense>
                            </HotkeysProvider>
                        </RecoilRoot>
                    </Suspense>
                }
            />
        </Routes>
    </BrowserRouter>,
);
