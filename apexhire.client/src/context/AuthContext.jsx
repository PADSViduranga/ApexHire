
import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

import authService from "../services/authService";

const TOKEN_KEY = "apexhire_token";
const USER_KEY = "apexhire_user";

const AuthContext = createContext(null);

function clearStoredAuthentication() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function readStoredUser() {
    const token = localStorage.getItem(
        TOKEN_KEY
    );

    const storedUserValue =
        localStorage.getItem(USER_KEY);

    if (!token || !storedUserValue) {
        clearStoredAuthentication();
        return null;
    }

    try {
        const storedUser =
            JSON.parse(storedUserValue);

        if (
            storedUser.expiresAt &&
            new Date(storedUser.expiresAt) <=
            new Date()
        ) {
            clearStoredAuthentication();
            return null;
        }

        return storedUser;
    } catch {
        clearStoredAuthentication();
        return null;
    }
}

function normalizeAuthResponse(result) {
    const data = result?.data ?? result;

    const token =
        data?.token ??
        data?.accessToken ??
        data?.jwtToken;

    if (!token) {
        throw new Error(
            "The server did not return an authentication token."
        );
    }

    const user = {
        userId:
            data?.userId ??
            data?.id ??
            data?.user?.userId ??
            data?.user?.id,

        fullName:
            data?.fullName ??
            data?.user?.fullName ??
            "",

        email:
            data?.email ??
            data?.user?.email ??
            "",

        role:
            data?.role ??
            data?.user?.role ??
            "Candidate",

        expiresAt:
            data?.expiresAt ??
            data?.user?.expiresAt ??
            null,
    };

    return {
        token,
        user,
    };
}

export function AuthProvider({
    children,
}) {
    const [user, setUser] = useState(
        readStoredUser
    );

    async function login(email, password) {
        const result =
            await authService.login(
                email,
                password
            );

        if (result?.success === false) {
            throw new Error(
                result.message ||
                "Login failed."
            );
        }

        const authentication =
            normalizeAuthResponse(result);

        localStorage.setItem(
            TOKEN_KEY,
            authentication.token
        );

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(
                authentication.user
            )
        );

        setUser(authentication.user);

        return authentication.user;
    }

    async function register(
        registrationData
    ) {
        const result =
            await authService.register(
                registrationData
            );

        if (result?.success === false) {
            throw new Error(
                result.message ||
                "Registration failed."
            );
        }

        return result;
    }

    function logout() {
        clearStoredAuthentication();
        setUser(null);
    }

    const value = useMemo(
        () => ({
            user,
            isAuthenticated:
                Boolean(user),
            login,
            register,
            logout,
        }),
        [user]
    );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}
