import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import type { User } from "./model/User";
import BaseApiAxios from "../../helpers/BaseApiAxios";
import { SERVICE_PATHS } from "../../constants/Paths";
import type { Parameter } from "./model/Parameter";

interface AuthenticationContextType {
    jwtToken: string | null;
    fillToken: (token: string) => void;
    clearToken: () => void;
    sessionUser: User | null;
    initSessionUser: () => void;
    parameters: Parameter[];
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jwtToken, setJwtToken] = useState<string | null>(localStorage.getItem("jwtToken"));
    const [sessionUser, setSessionUser] = useState<User | null>(null);
    const [parameters, setParameters] = useState<Parameter[]>([]);

    useEffect(() => {
        if (jwtToken) {
            initSessionUser();
            initParameters();
        }
    }, [jwtToken]);

    const fillToken = (newToken: string) => {
        localStorage.setItem("jwtToken", newToken);
        setJwtToken(newToken);
    };

    const clearToken = () => {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        setSessionUser(null);
    };

    const initSessionUser = async () => {
        const response = await BaseApiAxios.get(SERVICE_PATHS.API_V1_AUTHENTICATION_USER);
        setSessionUser(response?.data?.data);
    };

    const initParameters = async () => {
        const response = await BaseApiAxios.get(SERVICE_PATHS.API_V1_PARAMETER_FIND_ALL_FROM_CACHE);
        setParameters(response?.data?.data);
    }

    return (
        <AuthenticationContext.Provider value={{ jwtToken, fillToken, clearToken, sessionUser, initSessionUser, parameters }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export const useAuthentication = () => {
    const context = useContext(AuthenticationContext);
    if (!context) throw new Error("useAuthentication must be used within AuthenticationProvider");
    return context;
};