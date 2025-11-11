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
import { NAVIGATE_PATHS, SERVICE_PATHS } from '../constants/Paths';
import BaseApiAxios from '../helpers/BaseApiAxios';
import { useAuthentication } from '../contexts/authentication/AuthenticationContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiErrorHandler } from '../helpers/ApiErrorHandler';
import { TIMEOUT_MILLIS } from '../constants/Constants';

const ChangePassword: React.FC = () => {
    const { initSessionUser } = useAuthentication();
    const { handleApiError } = useApiErrorHandler();
    const location = useLocation();
    const navigate = useNavigate();

    // navigate ile gönderilen state
    const from = (location.state as { from?: string })?.from;

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ oldPassword?: string; newPassword?: string; confirmPassword?: string }>({});
    const [success, setSuccess] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!oldPassword) newErrors.oldPassword = 'Old Password is a required field.';
        if (!newPassword) newErrors.newPassword = 'New Password is a required field.';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is a required field.';
        else if (confirmPassword !== newPassword) newErrors.confirmPassword = 'Passwords don\'t match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        setSuccess('');
        setErrorMessage('');

        if (!validate()) return;

        setLoading(true);
        try {
            await BaseApiAxios.post(SERVICE_PATHS.API_V1_AUTHENTICATION_CHANGE_PASSWORD, {
                oldPassword,
                password: newPassword,
                confirmPassword,
            });

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            initSessionUser();
            setSuccess('Your password has been successfully changed!');
            setTimeout(() => setSuccess(''), TIMEOUT_MILLIS);

            setTimeout(() => {
                if (from) {
                    navigate(-1);
                } else {
                    navigate(NAVIGATE_PATHS.DASHBOARD);
                }
            }, TIMEOUT_MILLIS);
        } catch (err: any) {
            setErrorMessage(handleApiError(err));
            setTimeout(() => setErrorMessage(''), TIMEOUT_MILLIS);
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
                        Change Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Enter your old password and create a new password.
                    </Typography>
                </Box>

                {/* Başarı & Hata Mesajları */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                        {success}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {errorMessage}
                    </Alert>
                )}

                <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    disabled={loading}
                />

                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    disabled={loading}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={loading}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleChangePassword}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        mt: 2,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                </Button>

                <Box width="100%" textAlign="center" mt={1}>
                    {from ? (
                        <Link
                            href="#"
                            underline="hover"
                            variant="body2"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(-1);
                            }}
                        >
                            Back
                        </Link>
                    ) : (
                        <Link href={NAVIGATE_PATHS.LOGOUT} underline="hover" variant="body2">
                            Logout
                        </Link>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ChangePassword;
