import React from "react";
import BaseApiAxios from "../helpers/BaseApiAxios";
import { GOOGLE_CLIENT_ID, SERVICE_PATHS } from "../constants/Paths";
import { useAuthentication } from "../contexts/authentication/AuthenticationContext";

declare global {
    interface Window {
        google: any;
    }
}

const GoogleLoginButton: React.FC = () => {
    const { fillToken } = useAuthentication();
    const handleCredentialResponse = async (credentialResponse: any) => {
        console.log("Encoded JWT ID token: " + credentialResponse.credential);

        // BE'ye gönder
        try {
            const response = await BaseApiAxios.post(SERVICE_PATHS.API_V1_AUTHENTICATION_GOOGLE_LOGIN, {
                credential: credentialResponse.credential
            });

            fillToken(response?.data?.data?.token);
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        /* global google */
        (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });

        (window as any).google.accounts.id.renderButton(
            document.getElementById("googleSignIn")!,
            { theme: "outline", size: "large", text: "continue_with" } // opsiyonel stil
        );
    }, []);

    return <div id="googleSignIn"></div>;
};

export default GoogleLoginButton;
