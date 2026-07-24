import {
    useState,
} from "react";

import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AuthPage.css";

const initialForm = {
    email: "",
    password: "",
};

function getRoleDestination(role) {
    const normalizedRole =
        String(role || "")
            .trim()
            .toLowerCase();

    switch (normalizedRole) {
        case "recruiter":
            return "/recruiter/dashboard";

        case "hiringmanager":
        case "hiring manager":
            return "/hiring-manager/dashboard";

        case "admin":
        case "administrator":
            return "/admin/dashboard";

        case "candidate":
            return "/jobs";

        default:
            return "/";
    }
}

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        login,
        user,
        isAuthenticated,
    } = useAuth();

    const [form, setForm] =
        useState(initialForm);

    const [error, setError] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const registrationMessage =
        location.state
            ?.registrationMessage || "";

    const requestedDestination =
        location.state?.from?.pathname;

    if (isAuthenticated) {
        const authenticatedDestination =
            requestedDestination ||
            getRoleDestination(user?.role);

        return (
            <Navigate
                to={authenticatedDestination}
                replace
            />
        );
    }

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const email =
            form.email.trim();

        if (!email) {
            setError(
                "Please enter your email address."
            );
            return;
        }

        if (!form.password) {
            setError(
                "Please enter your password."
            );
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const loggedInUser =
                await login(
                    email,
                    form.password
                );

            const destination =
                requestedDestination ||
                getRoleDestination(
                    loggedInUser?.role
                );

            navigate(destination, {
                replace: true,
            });
        } catch (requestError) {
            console.error(
                "Login failed:",
                requestError
            );

            const responseData =
                requestError.response?.data;

            setError(
                responseData?.message ||
                responseData?.title ||
                requestError.message ||
                "Unable to log in. Please check your email and password."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-card__header">
                    <p className="auth-card__eyebrow">
                        Welcome back
                    </p>

                    <h1>
                        Log in to ApexHire
                    </h1>

                    <p>
                        Access your account and
                        continue managing your
                        career activities.
                    </p>
                </div>

                {registrationMessage && (
                    <div
                        className="auth-alert auth-alert--success"
                        role="status"
                    >
                        {registrationMessage}
                    </div>
                )}

                {error && (
                    <div
                        className="auth-alert"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="auth-form__group">
                        <label htmlFor="login-email">
                            Email address
                        </label>

                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={submitting}
                        />
                    </div>

                    <div className="auth-form__group">
                        <label htmlFor="login-password">
                            Password
                        </label>

                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={submitting}
                        />
                    </div>

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Logging in..."
                            : "Log In"}
                    </button>
                </form>

                <p className="auth-card__footer">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">
                        Create a Candidate account
                    </Link>
                </p>
            </section>
        </main>
    );
}
