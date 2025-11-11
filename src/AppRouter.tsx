import React, { type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { NAVIGATE_PATHS } from "./constants/Paths";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Logout from "./pages/authentication/Logout";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import VerifyAccount from "./pages/authentication/VerifyAccount";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/authentication/ResetPassword";
import SystemParameters from "./pages/SystemParameters";
import { useAuthentication } from "./contexts/authentication/AuthenticationContext";
import Layout from "./components/Layout";
import ERBuilder from "./pages/project-generator/ERBuilder";

interface RouteWithAuthorizationProps {
    element: React.ReactNode;
}


export const RouteWithAuthorization: React.FC<RouteWithAuthorizationProps> = ({ element }) => {
    const { jwtToken, sessionUser } = useAuthentication();
    if (!jwtToken) return <Navigate to="/login" />;

    if (sessionUser?.passwordValidUntil && new Date(sessionUser.passwordValidUntil) < new Date()) {
        return <ChangePassword />;
    }

    return <Layout>{element}</Layout>; // tüm private sayfalara header/footer
};

interface RouteWithoutAuthorizationProps {
    children: ReactNode;
}

const RouteWithoutAuthorization: React.FC<RouteWithoutAuthorizationProps> = ({ children }) => {
    const { jwtToken } = useAuthentication();
    return jwtToken ? <Navigate to="/dashboard" /> : children;
};

const AppRouter: React.FC = () => {
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
                    path={NAVIGATE_PATHS.ER_BUILDER}
                    element={<RouteWithAuthorization element={<ERBuilder />}></RouteWithAuthorization>}
                />
                <Route
                    path={NAVIGATE_PATHS.LOGOUT}
                    element={<RouteWithAuthorization element={<Logout />}></RouteWithAuthorization>}
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={NAVIGATE_PATHS.LOGIN} />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
