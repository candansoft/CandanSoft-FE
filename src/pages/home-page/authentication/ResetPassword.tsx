import React, { useState } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Link,
    CircularProgress,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BaseApiAxios from '../../../helpers/BaseApiAxios';
import { SERVICE_PATHS, NAVIGATE_PATHS } from '../../../constants/Paths';
import { useApiErrorHandler } from '../../../helpers/ApiErrorHandler';
import { TIMEOUT_MILLIS } from '../../../constants/Constants';

const ResetPassword: React.FC = () => {
    const { handleApiError } = useApiErrorHandler();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // URL'den token alıyoruz

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validate = () => {
        const newErrors: { newPassword?: string; confirmPassword?: string } = {};
        if (!newPassword) newErrors.newPassword = 'New Password is a required field.';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is a required field.';
        else if (confirmPassword !== newPassword)
            newErrors.confirmPassword = 'Passwords don\'t match';

        setError(Object.values(newErrors).join(', '));
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async () => {
        setError('');
        setSuccess('');

        if (!validate()) return;

        setLoading(true);
        try {
            console.log(token);
            await BaseApiAxios.post(SERVICE_PATHS.API_V1_AUTHENTICATION_RESET_PASSWORD, {
                token: token,
                password: newPassword,
                confirmPassword: confirmPassword,
            });

            setSuccess('Your password successfully changed!');
            setNewPassword('');
            setConfirmPassword('');

            // Başarılıysa login sayfasına yönlendirebiliriz
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
                        Reset Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Please enter and confirm your new password.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ py: 1.5, mt: 2, fontWeight: 'bold', borderRadius: 2 }}
                    onClick={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Parolayı Sıfırla'}
                </Button>

                <Box mt={3} textAlign="center">
                    <Typography variant="body2">
                        Did you remember?{' '}
                        <Link href={NAVIGATE_PATHS.LOGIN} underline="hover">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPassword;
