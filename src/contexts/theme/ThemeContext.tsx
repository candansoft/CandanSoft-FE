import { createContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = createContext({
    mode: "dark",
    toggleColorMode: () => { },
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
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
                        light: '#4b7094ff',
                        dark: '#4b7094ff'
                    },
                    secondary: {
                        main: "#77414fff",
                        light: '#77414fff',
                        dark: '#77414fff'
                    },
                    success: {
                        main: '#2e7d32',
                    },
                    error: {
                        main: '#d32f2f',
                    },
                    background: {
                        default: mode === "light" ? "#f4f6f8" : "#121212",
                        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
                    },
                    text: {
                        primary: mode === "light" ? "#1a1a1a" : "#e9e8e8ff", secondary: mode === "light" ? "#555" : "#b1b1b1ff"
                    }
                },
                shape: {
                    borderRadius: 10,
                },
                typography: {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    button: { textTransform: "none", fontWeight: 500 },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};
