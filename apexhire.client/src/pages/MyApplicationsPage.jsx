import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../api/apiClient";

import "./MyApplicationsPage.css";

const completedStatuses = [
    "Rejected",
    "Hired",
    "Withdrawn",
];

export default function MyApplicationsPage() {
    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [withdrawingId, setWithdrawingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {
        let cancelled = false;

        apiRequest(
            "/api/job-applications/mine"
        )
            .then((result) => {
                if (!cancelled) {
                    setApplications(
                        result.data ?? []
                    );
                }
            })
            .catch((requestError) => {
                if (!cancelled) {
                    setError(
                        requestError.message
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    async function withdrawApplication(
        applicationId
    ) {
        const confirmed =
            window.confirm(
                "Are you sure you want to withdraw this application?"
            );

        if (!confirmed) {
            return;
        }

        setWithdrawingId(applicationId);
        setError("");
        setSuccess("");

        try {
            const result =
                await apiRequest(
                    `/api/job-applications/${applicationId}/withdraw`,
                    {
                        method: "PUT",
                    }
                );

            setSuccess(
                result.message ||
                "Application withdrawn successfully."
            );

            setApplications(
                (currentApplications) =>
                    currentApplications.map(
                        (application) =>
                            application.id ===
                            applicationId
                                ? result.data
                                : application
                    )
            );
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to withdraw the application."
            );
        } finally {
            setWithdrawingId(null);
        }
    }

    return (
        <section className="my-applications-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Candidate dashboard
                    </p>

                    <h1>
                        My applications
                    </h1>

                    <p className="muted">
                        Follow the progress of
                        every job application you
                        have submitted.
                    </p>
                </div>

                <Link
                    className="button button-primary"
                    to="/jobs"
                >
                    Find more jobs
                </Link>
            </div>

            {error && (
                <div
                    className="alert alert-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="alert alert-success"
                    role="status"
                >
                    {success}
                </div>
            )}

            {loading ? (
                <p className="status-message">
                    Loading applications...
                </p>
            ) : applications.length ===
              0 ? (
                <div className="empty-state">
                    <h2>
                        No applications yet
                    </h2>

                    <p>
                        Search the available
                        jobs and submit your
                        first application.
                    </p>

                    <Link
                        className="button button-primary"
                        to="/jobs"
                    >
                        Browse jobs
                    </Link>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Job</th>
                                <th>
                                    Organization
                                </th>
                                <th>Status</th>
                                <th>Applied</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.map(
                                (
                                    application
                                ) => {
                                    const canWithdraw =
                                        !completedStatuses.includes(
                                            application.status
                                        );

                                    return (
                                        <tr
                                            key={
                                                application.id
                                            }
                                        >
                                            <td>
                                                {
                                                    application.jobTitle
                                                }
                                            </td>

                                            <td>
                                                {
                                                    application.organizationName
                                                }
                                            </td>

                                            <td>
                                                <span className="badge">
                                                    {
                                                        application.status
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {new Date(
                                                    application.appliedAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Link
                                                        to={`/jobs/${application.jobPostId}`}
                                                    >
                                                        View job
                                                    </Link>

                                                    {canWithdraw && (
                                                        <button
                                                            type="button"
                                                            className="button button-danger button-small"
                                                            disabled={
                                                                withdrawingId ===
                                                                application.id
                                                            }
                                                            onClick={() =>
                                                                withdrawApplication(
                                                                    application.id
                                                                )
                                                            }
                                                        >
                                                            {withdrawingId ===
                                                            application.id
                                                                ? "Withdrawing..."
                                                                : "Withdraw"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
