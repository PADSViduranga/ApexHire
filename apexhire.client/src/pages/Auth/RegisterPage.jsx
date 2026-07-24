import {
    useState,
} from "react";

import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AuthPage.css";

const initialForm = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterPage() {
    const navigate = useNavigate();

    const {
        register,
        isAuthenticated,
    } = useAuth();

    const [form, setForm] =
        useState(initialForm);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    if (isAuthenticated) {
        return (
            <Navigate
                to="/"
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

        if (success) {
            setSuccess("");
        }
    }

    function validateForm() {
        const fullName =
            form.fullName.trim();

        const email =
            form.email.trim();

        if (!fullName) {
            return "Please enter your full name.";
        }

        if (fullName.length < 3) {
            return "Full name must contain at least 3 characters.";
        }

        if (!email) {
            return "Please enter your email address.";
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return "Please enter a valid email address.";
        }

        if (!form.password) {
            return "Please enter a password.";
        }

        if (form.password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (!form.confirmPassword) {
            return "Please confirm your password.";
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            return "Passwords do not match.";
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const result =
                await register({
                    fullName:
                        form.fullName,
                    email:
                        form.email,
                    password:
                        form.password,
                    confirmPassword:
                        form.confirmPassword,
                });

            setSuccess(
                result?.message ||
                "Registration completed successfully."
            );

            setForm({
                ...initialForm,
            });

            window.setTimeout(() => {
                navigate("/login", {
                    replace: true,
                    state: {
                        registrationMessage:
                            "Your Candidate account was created successfully. Please log in.",
                    },
                });
            }, 1200);
        } catch (requestError) {
            console.error(
                "Registration failed:",
                requestError
            );

            const responseData =
                requestError.response?.data;

            const validationErrors =
                responseData?.errors;

            let errorMessage =
                responseData?.message ||
                responseData?.title ||
                requestError.message ||
                "Unable to create your account.";

            if (validationErrors) {
                const firstError =
                    Object.values(
                        validationErrors
                    )
                        .flat()
                        .find(Boolean);

                if (firstError) {
                    errorMessage =
                        firstError;
                }
            }

            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-card__header">
                    <p className="auth-card__eyebrow">
                        Join ApexHire
                    </p>

                    <h1>
                        Create your Candidate
                        account
                    </h1>

                    <p>
                        Build your profile,
                        discover job
                        opportunities, and manage
                        your applications.
                    </p>
                </div>

                {error && (
                    <div
                        className="auth-alert"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="auth-alert auth-alert--success"
                        role="status"
                    >
                        {success}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >
                    <div className="auth-form__group">
                        <label htmlFor="register-full-name">
                            Full name
                        </label>

                        <input
                            id="register-full-name"
                            name="fullName"
                            type="text"
                            value={
                                form.fullName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your full name"
                            autoComplete="name"
                            maxLength={100}
                            disabled={
                                submitting
                            }
                        />
                    </div>

                    <div className="auth-form__group">
                        <label htmlFor="register-email">
                            Email address
                        </label>

                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            value={
                                form.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            maxLength={150}
                            disabled={
                                submitting
                            }
                        />
                    </div>

                    <div className="auth-form__group">
                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            value={
                                form.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                            disabled={
                                submitting
                            }
                        />
                    </div>

                    <div className="auth-form__group">
                        <label htmlFor="register-confirm-password">
                            Confirm password
                        </label>

                        <input
                            id="register-confirm-password"
                            name="confirmPassword"
                            type="password"
                            value={
                                form.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your password again"
                            autoComplete="new-password"
                            disabled={
                                submitting
                            }
                        />
                    </div>

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={
                            submitting
                        }
                    >
                        {submitting
                            ? "Creating account..."
                            : "Create Candidate Account"}
                    </button>
                </form>

                <p className="auth-card__footer">
                    Already have an
                    account?{" "}
                    <Link to="/login">
                        Log in
                    </Link>
                </p>
            </section>
        </main>
    );
}