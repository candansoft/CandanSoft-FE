import React, { useContext, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import {
    ListOutlined,
    Brightness4,
    Brightness7,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { NAVIGATE_PATHS } from "../constants/Paths";
import { PROJECT_NAME } from "../constants/Constants";
import { useAuthentication } from "../contexts/authentication/AuthenticationContext";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "../contexts/theme/ThemeContext";

const Header: React.FC = () => {
    const { jwtToken, sessionUser } = useAuthentication();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const colorMode = useContext(ThemeContext);

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
                    <Button onClick={() => {
                        if (jwtToken) {
                            setDrawerOpen(true);
                        } else {
                            navigate(NAVIGATE_PATHS.HOMEPAGE);
                        }
                    }}
                        startIcon={<ListOutlined />}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.25rem', // Typography h6 ile uyumlu 
                            color: 'inherit', // yazı rengi değişmesin 
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            textTransform: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            '&:hover, &:active': {
                                backgroundColor: 'rgba(255,255,255,0.1)', // hover ve basılı tutulduğunda arka plan }, 
                            }
                        }} >
                        {PROJECT_NAME}
                    </Button>

                    {/* Sağ taraf: Butonlar */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <IconButton
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                            sx={{ ml: 1, transition: 'transform 0.3s', '&:hover': { transform: 'rotate(20deg)' } }}
                        >
                            {colorMode.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        {!jwtToken ? <>
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
                        </>
                            :
                            <>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    href={NAVIGATE_PATHS.LOGOUT}
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
                                    }}>
                                    Çıkış
                                </Button>
                            </>
                        }
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Modern Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor:
                            theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",
                        color: theme.palette.text.primary,
                        width: 260,
                    },
                }}
            >
                <Box sx={{ pt: 2, pl: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {PROJECT_NAME}
                    </Typography>
                </Box>
                <Box>
                    <List>
                        <ListItem
                            key='dashboard'
                            component='button'
                            onClick={() => {
                                navigate(NAVIGATE_PATHS.DASHBOARD);
                                setDrawerOpen(false);
                            }}>
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        <ListItem
                            key='changePassword' component='button'
                            onClick={() => {
                                navigate(NAVIGATE_PATHS.CHANGE_PASSWORD, {
                                    state: { from: location.pathname },
                                });
                                setDrawerOpen(false);
                            }}>
                            <ListItemText primary="Change Password" />
                        </ListItem>
                    </List>
                </Box>
                {sessionUser?.roleList.includes("SYSTEM_ADMINISTRATOR") && (
                    <>
                        <Box sx={{ pt: 2, pl: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Administration
                            </Typography>
                        </Box>
                        <Box>
                            <ListItem
                                key='systemParameters'
                                component='button'
                                onClick={() => {
                                    navigate(NAVIGATE_PATHS.SYSTEM_PARAMETERS);
                                    setDrawerOpen(false);
                                }}
                            >
                                <ListItemText primary="System Parameters" />
                            </ListItem>
                        </Box>
                    </>
                )}
                <Box>
                    <List>
                        <ListItem
                            key='logout' component='button'
                            onClick={() => navigate(NAVIGATE_PATHS.LOGOUT)}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>

            </Drawer>
        </>
    );
};

export default Header;
