import {
    Navigate,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
}) {
    const location = useLocation();

    const {
        user,
        isAuthenticated,
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    if (
        Array.isArray(allowedRoles) &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
            user?.role
        )
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}