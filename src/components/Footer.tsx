import React, { useContext } from 'react';
import { PROJECT_NAME } from '../constants/Constants';
import { ThemeContext } from '../contexts/theme/ThemeContext';
import {
    Typography,
    Box,
    Link,
} from '@mui/material';

const Footer: React.FC = () => {
    const colorMode = useContext(ThemeContext);

    return (
        <>
            {/* 👣 FOOTER */}
            < Box sx={{ bgcolor: colorMode.mode === "dark" ? "#000" : "#d4d4d46b", py: 4, textAlign: "center" }
            }>
                <Typography variant="body2" color={colorMode.mode === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0, 0, 0, 0.8)"}>
                    © {new Date().getFullYear()} {PROJECT_NAME} — Yazılımda Güven ve Güç
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        Gizlilik
                    </Link>
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        Kullanım Şartları
                    </Link>
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        İletişim
                    </Link>
                </Box>
            </Box >
        </>
    );
};

export default Footer;
