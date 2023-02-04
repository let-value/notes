import { Route, Routes } from "react-router-dom";
import { GDrive } from "./GDrive";

export const Oidc = () => {
    return (
        <Routes>
            <Route path="gdrive" element={<GDrive />} />
        </Routes>
    );
};
