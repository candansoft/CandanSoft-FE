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
    Alert,
    CircularProgress,
} from '@mui/material';
import BaseApiAxios from '../../../helpers/BaseApiAxios';
import { SERVICE_PATHS } from '../../../constants/Paths';
import { useApiErrorHandler } from '../../../helpers/ApiErrorHandler';
import GoogleLoginButton from '../../../components/GoogleLoginButton';

const Register: React.FC = () => {
    const { handleApiError } = useApiErrorHandler();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validate = () => {
        const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

        if (!email) {
            newErrors.email = 'Email is a required field.';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is a required field.';
        }


        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is a required field.';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords don\'t match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        setSuccessMessage('');
        setErrorMessage('');

        if (!validate()) return;

        setLoading(true);
        try {
            await BaseApiAxios.post(SERVICE_PATHS.API_V1_AUTHENTICATION_REGISTER, {
                username: email,
                password: password,
                confirmPassword: confirmPassword
            });

            // Token geri dönerse fillToken ile session açabilirsiniz
            // const token = response.data.data.token;
            // fillToken(token);

            setSuccessMessage('An activation link has been sent to your email. You can log in to the application after clicking the link.');
        } catch (err: any) {
            setErrorMessage(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
        >
            <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Register
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Enter your information to create an account.
                    </Typography>
                </Box>

                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

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

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
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
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRegister}
                    sx={{ py: 1.5, mt: 2, fontWeight: 'bold', borderRadius: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>

                <Divider sx={{ width: '100%', textTransform: "uppercase", my: 2 }}>or</Divider>

                <GoogleLoginButton />

                <Box mt={3} textAlign="center">
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link href="/login" underline="hover">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
