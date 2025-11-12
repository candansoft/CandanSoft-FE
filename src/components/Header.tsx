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
    const { sessionUser } = useAuthentication();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const colorMode = useContext(ThemeContext);

    return (
        <>
            <AppBar position="static" color="primary" elevation={2}>
                <Toolbar style={{ padding: 0 }}
                    sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* PROJECT_NAME (sol) */}
                    <Button onClick={() => setDrawerOpen(true)}
                        startIcon={<ListOutlined />}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.25rem', // Typography h6 ile uyumlu 
                            color: 'inherit', // yazı rengi değişmesin 
                            height: 60,
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

                    {/* Sağ taraf */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                            sx={{ ml: 1 }}
                        >
                            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>

                        <Button
                            href={NAVIGATE_PATHS.LOGOUT}
                            color="inherit"
                            endIcon={<LogoutIcon />}
                            sx={{
                                textTransform: "none",
                                height: 60,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                            }}
                        >
                            Logout
                        </Button>
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

                            <List>
                                <ListItem
                                    key='erBuilder'
                                    component='button'
                                    onClick={() => {
                                        navigate(NAVIGATE_PATHS.ER_BUILDER);
                                        setDrawerOpen(false);
                                    }}
                                >
                                    <ListItemText primary="ER Builder" />
                                </ListItem>
                            </List>
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
