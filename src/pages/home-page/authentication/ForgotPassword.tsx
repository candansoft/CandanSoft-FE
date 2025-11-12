import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material';
import { NAVIGATE_PATHS, SERVICE_PATHS } from '../../../constants/Paths';
import BaseApiAxios from '../../../helpers/BaseApiAxios';
import { useApiErrorHandler } from '../../../helpers/ApiErrorHandler';
import { TIMEOUT_MILLIS } from '../../../constants/Constants';

const ForgotPassword: React.FC = () => {
    const { handleApiError } = useApiErrorHandler();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const handleSend = async () => {
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email is a required field.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            await BaseApiAxios.post(
                SERVICE_PATHS.API_V1_AUTHENTICATION_SEND_PASSWORD_RESET_LINK,
                { username: email }
            );

            setSuccess('The password reset link has been sent to your email!');
            setEmail('');
            setTimeout(() => navigate(NAVIGATE_PATHS.LOGIN), TIMEOUT_MILLIS);
        } catch (err: any) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 3,
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Forgot your password?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Enter your email, and we will send you a password reset link.
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSend}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        mt: 2,
                        fontWeight: 'bold',
                        borderRadius: 2,
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Send'
                    )}
                </Button>

                <Box mt={3} textAlign="center">
                    <Typography variant="body2">
                        Remembered it?{' '}
                        <Link href={NAVIGATE_PATHS.LOGIN} underline="hover">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
