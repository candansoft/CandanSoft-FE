import React, { useState } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    Link,
    Paper,
    IconButton,
    InputAdornment,
    Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import BaseApiAxios from '../../../helpers/BaseApiAxios';
import { NAVIGATE_PATHS, SERVICE_PATHS } from '../../../constants/Paths';
import { useAuthentication } from '../../../contexts/authentication/AuthenticationContext';
import { useApiErrorHandler } from '../../../helpers/ApiErrorHandler';
import GoogleLoginButton from '../../../components/GoogleLoginButton';

const Login: React.FC = () => {
    const { fillToken } = useAuthentication();
    const { handleApiError } = useApiErrorHandler();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is a required field.';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is a required field.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        setApiError('');

        try {
            const response = await BaseApiAxios.post(SERVICE_PATHS.API_V1_AUTHENTICATION_LOGIN, {
                username: email,
                password: password,
            });

            const token = response.data.data.token;
            fillToken(token);
        } catch (err: any) {
            setApiError(handleApiError(err));

            // 3 saniye sonra hata mesajını temizle
            setTimeout(() => setApiError(''), 3000);
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
                        Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign in to your account or continue with Google.
                    </Typography>
                </Box>

                {/* API Hatası */}
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}

                {/* E-Posta */}
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                {/* Parola */}
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Parolanızı mı unuttunuz */}
                <Box width="100%" textAlign="right" mt={0.5} mb={2}>
                    <Link href={NAVIGATE_PATHS.FORGOT_PASSWORD} underline="hover" variant="body2">
                        Forgot your password?
                    </Link>
                </Box>

                {/* Giriş Yap Butonu */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ py: 1.5, mb: 2, fontWeight: 'bold', borderRadius: 2 }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>

                {/* Divider */}
                <Divider sx={{ width: '100%', textTransform: "uppercase", my: 2 }}>or</Divider>

                <GoogleLoginButton />

                <Box mt={3} textAlign="center">
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link href={NAVIGATE_PATHS.REGISTER} underline="hover">
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
