import React, { type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { NAVIGATE_PATHS } from "./constants/Paths";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import SystemParameters from "./pages/SystemParameters";
import { useAuthentication } from "./contexts/authentication/AuthenticationContext";
import Layout from "./components/Layout";
import Login from "./pages/home-page/authentication/Login";
import Register from "./pages/home-page/authentication/Register";
import ForgotPassword from "./pages/home-page/authentication/ForgotPassword";
import ResetPassword from "./pages/home-page/authentication/ResetPassword";
import VerifyAccount from "./pages/home-page/authentication/VerifyAccount";
import { Logout } from "@mui/icons-material";
import HomePage from "./pages/home-page/HomePage";

interface RouteWithAuthorizationProps {
    element: React.ReactNode;
}

interface RouteWithoutAuthorizationProps {
    children: ReactNode;
}
const AppRouter: React.FC = () => {
    const { jwtToken, sessionUser } = useAuthentication();

    const RouteWithAuthorization: React.FC<RouteWithAuthorizationProps> = ({ element }) => {
        if (!jwtToken) return <Navigate to="/login" />;

        if (sessionUser?.passwordValidUntil && new Date(sessionUser.passwordValidUntil) < new Date()) {
            return <ChangePassword />;
        }

        return <Layout>{element}</Layout>; // tüm private sayfalara header/footer
    };

    const RouteWithoutAuthorization: React.FC<RouteWithoutAuthorizationProps> = ({ children }) => {
        return jwtToken ? <Navigate to="/dashboard" /> : children;
    };

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route
                    path={NAVIGATE_PATHS.LOGIN}
                    element={<RouteWithoutAuthorization><Login /></RouteWithoutAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.REGISTER}
                    element={<RouteWithoutAuthorization><Register /></RouteWithoutAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.FORGOT_PASSWORD}
                    element={<RouteWithoutAuthorization><ForgotPassword /></RouteWithoutAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.RESET_PASSWORD}
                    element={<RouteWithoutAuthorization><ResetPassword /></RouteWithoutAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.VERIFY_ACCOUNT}
                    element={<RouteWithoutAuthorization><VerifyAccount /></RouteWithoutAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.HOMEPAGE}
                    element={<RouteWithoutAuthorization><HomePage /></RouteWithoutAuthorization>}
                />

                {/* Private routes */}
                <Route
                    path={NAVIGATE_PATHS.DASHBOARD}
                    element={<RouteWithAuthorization element={<Dashboard />}></RouteWithAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.CHANGE_PASSWORD}
                    element={<RouteWithAuthorization element={<ChangePassword />}></RouteWithAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.SYSTEM_PARAMETERS}
                    element={<RouteWithAuthorization element={<SystemParameters />}></RouteWithAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.LOGOUT}
                    element={<RouteWithAuthorization element={<Logout />}></RouteWithAuthorization>}
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={NAVIGATE_PATHS.HOMEPAGE} />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
