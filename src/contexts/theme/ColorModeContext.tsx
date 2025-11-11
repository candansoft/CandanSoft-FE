import { createContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext({
    mode: "dark",
    toggleColorMode: () => { },
});

export const ColorModeContextProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<"light" | "dark">("dark");

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => {
                setMode((prev) => (prev === "light" ? "dark" : "light"));
            },
        }),
        [mode]
    );

    // 🎨 Tema tanımı
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: "#4b7094ff",
                    },
                    secondary: {
                        main: "#77414fff",
                    },
                    background: {
                        default: mode === "light" ? "#f4f6f8" : "#121212",
                        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
                    },
                },
                shape: {
                    borderRadius: 10,
                },
                typography: {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    button: { textTransform: "none" },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    );
};
