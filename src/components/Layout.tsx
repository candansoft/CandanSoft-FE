import React, { type ReactNode } from 'react';
import {
    Alert,
    Box,
    Snackbar,
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { SHOW_ERROR_MILLIS, SHOW_SUCCES_MILLIS, SHOW_WARNING_MILLIS } from '../constants/Constants';
import { useNotification } from '../contexts/notification/NotificationContext';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { success, setSuccess, error, setError, warning, setWarning } = useNotification();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            {/* Content */}
            <Box sx={{ flex: 1 }}>{children}</Box>

            <Snackbar open={!!success} autoHideDuration={SHOW_SUCCES_MILLIS} onClose={() => setSuccess("")} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert severity="success" sx={{ width: "100%" }}>
                    {success}
                </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={SHOW_ERROR_MILLIS} onClose={() => setError("")} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!warning} autoHideDuration={SHOW_WARNING_MILLIS} onClose={() => setWarning("")} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert severity="warning" sx={{ width: "100%" }}>
                    {warning}
                </Alert>
            </Snackbar>
            <Footer />
        </Box>
    );
};

export default Layout;
