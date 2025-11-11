//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createTheme, CssBaseline } from '@mui/material';
import { ColorModeContextProvider } from './contexts/theme/ColorModeContext.tsx';

// 🎨 Özel Tema Tanımı
const theme = createTheme({
  palette: {
    mode: 'light', // dark da yapabilirsin
    primary: {
      main: '#1976d2', // Ana mavi renk
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0', // Mor
      light: '#d05ce3',
      dark: '#6a0080',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f4f6f8', // sayfa arka planı
      paper: '#ffffff',   // kartlar, paneller
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Butonlarda büyük harf olmasın
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10, // Kartlar, butonlar köşeleri yuvarlak
  },
});

createRoot(document.getElementById('root')!).render(
  /*<StrictMode>*/
  <ColorModeContextProvider>
    <CssBaseline /> {/* Tarayıcı varsayılan stillerini sıfırlar */}
    < App />
  </ColorModeContextProvider>
  /*</StrictMode>*/
)
