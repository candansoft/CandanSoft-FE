import { useEffect } from "react";
import { useAuthentication } from "../../../contexts/authentication/AuthenticationContext";
import { NAVIGATE_PATHS } from "../../../constants/Paths";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const { clearToken } = useAuthentication();
    const navigate = useNavigate();

    useEffect(() => {
        clearToken();
        navigate(NAVIGATE_PATHS.HOMEPAGE);
    }, []);

    return null;
};

export default Logout;