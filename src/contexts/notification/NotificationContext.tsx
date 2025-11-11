import React, { createContext, useState, useContext, type ReactNode, type SetStateAction, type Dispatch } from "react";

interface NotificationContextType {
    success: string;
    setSuccess: Dispatch<SetStateAction<string>>;
    error: string;
    setError: Dispatch<SetStateAction<string>>;
    warning: string;
    setWarning: Dispatch<SetStateAction<string>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    return (
        <NotificationContext.Provider value={{ success, setSuccess, error, setError, warning, setWarning }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
};