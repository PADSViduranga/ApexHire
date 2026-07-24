import { useEffect, useState } from "react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import { apiRequest } from "../api/apiClient";

import "./MyInterviewsPage.css";

export default function MyInterviewsPage() {
    const location = useLocation();

    const [interviews, setInterviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const successMessage =
        location.state?.message ?? "";

    useEffect(() => {
        let cancelled = false;

        apiRequest("/api/interviews/mine")
            .then((result) => {
                if (!cancelled) {
                    setInterviews(
                        result.data ?? []
                    );
                }
            })
            .catch((requestError) => {
                if (!cancelled) {
                    setError(
                        requestError.message ||
                        "Unable to load interviews."
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

    function isCompleted(status) {
        return (
            status?.toLowerCase() ===
            "completed"
        );
    }

    return (
        <section className="my-interviews-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Candidate workspace
                    </p>

                    <h1>
                        My interviews
                    </h1>

                    <p className="muted">
                        View your scheduled
                        interview details and
                        instructions.
                    </p>
                </div>
            </div>

            {successMessage && (
                <div
                    className="alert alert-success"
                    role="status"
                >
                    {successMessage}
                </div>
            )}

            {error && (
                <div
                    className="alert alert-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {loading ? (
                <p className="status-message">
                    Loading interviews...
                </p>
            ) : interviews.length === 0 ? (
                <div className="empty-state">
                    <h2>
                        No interviews scheduled
                    </h2>

                    <p>
                        Interview information
                        will appear here when a
                        hiring manager schedules
                        one.
                    </p>
                </div>
            ) : (
                <div className="interview-grid">
                    {interviews.map(
                        (interview) => (
                            <article
                                className="interview-card"
                                key={interview.id}
                            >
                                <div className="card-row">
                                    <span className="badge">
                                        {
                                            interview.status
                                        }
                                    </span>

                                    <span className="duration">
                                        {
                                            interview.durationMinutes
                                        }{" "}
                                        minutes
                                    </span>
                                </div>

                                <h2>
                                    {
                                        interview.jobTitle
                                    }
                                </h2>

                                <div className="interview-details">
                                    <div className="detail-item">
                                        <span className="detail-label">
                                            Date and time
                                        </span>

                                        <span className="detail-value">
                                            {new Date(
                                                interview.scheduledAt
                                            ).toLocaleString()}
                                        </span>
                                    </div>

                                    {interview.location && (
                                        <div className="detail-item">
                                            <span className="detail-label">
                                                Location
                                            </span>

                                            <span className="detail-value">
                                                {
                                                    interview.location
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {interview.instructions && (
                                        <div className="detail-item">
                                            <span className="detail-label">
                                                Instructions
                                            </span>

                                            <span className="detail-value">
                                                {
                                                    interview.instructions
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="form-actions">
                                    {interview.meetingUrl && (
                                        <a
                                            className="button button-primary"
                                            href={
                                                interview.meetingUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open meeting
                                        </a>
                                    )}

                                    {isCompleted(
                                        interview.status
                                    ) && (
                                        <Link
                                            className="button button-secondary"
                                            to={`/interviews/${interview.id}/feedback`}
                                        >
                                            Give feedback
                                        </Link>
                                    )}
                                </div>
                            </article>
                        )
                    )}
                </div>
            )}
        </section>
    );
}
