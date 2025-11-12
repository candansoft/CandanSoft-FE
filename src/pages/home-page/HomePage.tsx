import React, { useContext } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Grid,
    Link,
    IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled, useTheme } from "@mui/system";
import { Link as RouterLink } from "react-router-dom";
import { NAVIGATE_PATHS } from "../../constants/Paths";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import { PROJECT_NAME } from "../../constants/Constants";

interface FloatingOrb {
    size: number;
    top: string;
    left: string;
    color: string;
}

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export default function HomePage() {
    const theme = useTheme();
    const colorMode = useContext(ThemeContext);

    const GradientText = styled("span")({
        background: "linear-gradient(90deg, #42a5f5, #26c6da, #00acc1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    });

    const HeroSection = styled(Box)(({ theme }) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: colorMode.mode === "dark" ? "#fff" : "#000",
        background:
            colorMode.mode === "dark"
                ? "radial-gradient(circle at top left, #0d47a1 0%, #000 60%)"
                : "radial-gradient(circle at top left, #90caf9 0%, #e3f2fd 60%)",
        overflow: "hidden",
        position: "relative",
    }));

    const FloatingOrb = styled(motion.div)(({ size, top, left, color }: FloatingOrb) => ({
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0.3,
    }));

    const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
        <motion.div
            whileHover={{ y: -5, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
                backgroundColor: colorMode.mode === "light" ? "rgba(223, 223, 223, 0.5)" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "2rem",
                textAlign: "center",
                backdropFilter: "blur(8px)",
            }}
        >
            <Box sx={{ fontSize: 50, mb: 1 }}>{icon}</Box>
            <Typography variant="h6" sx={{ mb: 1, color: "inherit" }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: colorMode.mode === "light" ? "#1a1a1a" : "rgba(255,255,255,0.6)" }}>
                {description}
            </Typography>
        </motion.div>
    );

    return (
        <>
            {/* 🔝 NAVBAR */}
            <AppBar
                position="sticky"
                color="transparent"
                elevation={0}
                sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: colorMode.mode === "dark"
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(255,255,255,0.3)",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 4, py: 1 }}>
                    {/* Sol taraf: Logo / Anasayfa */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: "none",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "primary.main",
                            "&:hover": { opacity: 0.8, transform: "scale(1.05)" },
                            transition: "all 0.3s ease",
                        }}
                    >
                        {PROJECT_NAME}
                    </Typography>

                    {/* Sağ taraf: Butonlar */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <IconButton
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                            sx={{ ml: 1, transition: 'transform 0.3s', '&:hover': { transform: 'rotate(20deg)' } }}
                        >
                            {colorMode.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/apps"
                            sx={{ textTransform: "none", "&:hover": { color: "primary.light" } }}
                        >
                            Uygulamalar
                        </Button>

                        <Button
                            color="inherit"
                            href={NAVIGATE_PATHS.LOGIN}
                            sx={{ textTransform: "none", "&:hover": { color: "primary.light", backgroundColor: "rgba(66, 165, 245, 0.1)" } }}
                        >
                            Giriş Yap
                        </Button>

                        <Button
                            color="primary"
                            variant="contained"
                            href={NAVIGATE_PATHS.REGISTER}
                            sx={{
                                textTransform: "none",
                                borderRadius: 3,
                                px: 3,
                                py: 1,
                                boxShadow: "0 4px 15px rgba(66, 165, 245, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(90deg,#42a5f5,#26c6da)",
                                    boxShadow: "0 6px 20px rgba(66, 165, 245, 0.5)",
                                },
                            }}
                        >
                            Kaydol
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 🧠 HERO */}
            <HeroSection>
                <FloatingOrb
                    size={300}
                    top="10%"
                    left="70%"
                    color="#42a5f5"
                    animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                />
                <FloatingOrb
                    size={250}
                    top="60%"
                    left="10%"
                    color="#26c6da"
                    animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                        <GradientText>Candan Soft</GradientText> ile
                        <br /> Dijital Dünyaya Adım At!
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Typography
                        variant="h6"
                        sx={{ maxWidth: 600, mx: "auto", color: colorMode.mode === "light" ? "#1a1a1a" : "rgba(255,255,255,0.7)", mb: 4 }}
                    >
                        Uygulamalar geliştir, kullanıcılarını davet et, gelir elde et.
                        Gücünü yazılımdan alan bir ekosisteme hoş geldin.
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 4,
                            fontWeight: "bold",
                            background: "linear-gradient(90deg,#42a5f5,#26c6da)",
                        }}
                    >
                        Başla
                    </Button>
                </motion.div>
            </HeroSection>

            {/* ⚙️ FEATURES */}
            <Box sx={{ bgcolor: colorMode.mode === "dark" ? "#0a0a0a" : "#f5f5f5", py: 12 }}>
                <Container>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            mb: 6,
                            fontWeight: "bold",
                            background: "linear-gradient(90deg,#42a5f5,#26c6da)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Neden Candan Soft?
                    </Typography>

                    <Grid container spacing={4}>
                        <FeatureCard
                            icon="💸"
                            title="Kazançlı Referans Sistemi"
                            description="Arkadaşlarını davet et, aboneliklerinden %50’ye varan komisyon kazan."
                        />
                        <FeatureCard
                            icon="🧠"
                            title="Akıllı Uygulamalar"
                            description="Finans, sağlık, kişisel gelişim ve daha fazlası için güçlü SaaS çözümleri."
                        />
                        <FeatureCard
                            icon="🔐"
                            title="Güvenli Altyapı"
                            description="Tüm işlemler şifrelenmiş, güvenli ve ölçeklenebilir bulut ortamında çalışır."
                        />
                    </Grid>
                </Container>
            </Box>

            {/* 👣 FOOTER */}
            <Box sx={{ bgcolor: colorMode.mode === "dark" ? "#000" : "#d4d4d46b", py: 4, textAlign: "center" }}>
                <Typography variant="body2" color={colorMode.mode === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0, 0, 0, 0.8)"}>
                    © {new Date().getFullYear()} Candan Soft — Yazılımda Güven ve Güç
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
            </Box>
        </>
    );
}
