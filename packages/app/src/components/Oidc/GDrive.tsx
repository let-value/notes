import { useEffect } from "react";
import { gdriveManager } from "../../features/oidc/gdriveManager";

export const GDrive = () => {
    useEffect(() => {
        gdriveManager.signinPopupCallback(window.location.href);
    }, []);

    return <>Window will close automatically</>;
};
