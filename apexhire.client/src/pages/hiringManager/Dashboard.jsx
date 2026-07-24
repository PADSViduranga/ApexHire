import { useEffect, useState } from "react";

import hiringManagerService
    from "../../services/hiringManagerService";

import "../../styles/HiringManagerDashboard.css";

function formatDate(value) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString();
}

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.errors?.[0] ??
        error?.message ??
        "Unable to load dashboard."
    );
}

function normalizeStatus(status) {
    return String(status ?? "Not available")
        .replace(/([a-z])([A-Z])/g, "$1 $2");
}

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchDashboard() {
            setLoading(true);
            setErrorMessage("");

            try {
                const data =
                    await hiringManagerService
                        .getDashboardData();

                if (isMounted) {
                    setDashboard(data);
                }
            }
            catch (error) {
                console.error(
                    "Unable to load Hiring Manager dashboard:",
                    error
                );

                if (isMounted) {
                    setErrorMessage(
                        getErrorMessage(error)
                    );
                }
            }
            finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="hm-dashboard">
                <div className="hm-loading">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="hm-dashboard">
                <div
                    className="hm-error"
                    role="alert"
                >
                    <h2>
                        Dashboard could not be loaded
                    </h2>

                    <p>{errorMessage}</p>
                </div>
            </div>
        );
    }

    const stats =
        dashboard?.statistics ?? {};

    const recentApplications =
        dashboard?.recentApplications ?? [];

    const upcomingInterviews =
        dashboard?.upcomingInterviews ?? [];

    const recentFeedback =
        (dashboard?.feedback ?? []).slice(0, 5);

    return (
        <div className="hm-dashboard">
            <header className="hm-page-header">
                <div>
                    <h1>
                        Hiring Manager Dashboard
                    </h1>

                    <p>
                        Review applications, interviews,
                        offers and candidate feedback.
                    </p>
                </div>

                <button
                    type="button"
                    className="hm-refresh-button"
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Refresh
                </button>
            </header>

            <section className="hm-stat-grid">
                <article className="hm-card">
                    <h4>Total Applications</h4>
                    <h2>
                        {stats.totalApplications ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Under Review</h4>
                    <h2>
                        {stats.underReview ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Shortlisted</h4>
                    <h2>
                        {stats.shortlisted ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Total Interviews</h4>
                    <h2>
                        {stats.totalInterviews ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Upcoming Interviews</h4>
                    <h2>
                        {stats.upcomingInterviews ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Offers</h4>
                    <h2>
                        {stats.offered ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Hired</h4>
                    <h2>
                        {stats.hired ?? 0}
                    </h2>
                </article>

                <article className="hm-card">
                    <h4>Rejected</h4>
                    <h2>
                        {stats.rejected ?? 0}
                    </h2>
                </article>
            </section>

            <div className="hm-two-columns">
                <section className="hm-panel">
                    <div className="hm-panel-header">
                        <h2>Recent Applications</h2>

                        <span>
                            {recentApplications.length}
                        </span>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div className="hm-empty">
                            No recent applications found.
                        </div>
                    ) : (
                        <div className="hm-table-wrapper">
                            <table className="hm-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentApplications.map(
                                        application => (
                                            <tr
                                                key={
                                                    application.id
                                                }
                                            >
                                                <td>
                                                    {application
                                                        .candidateName ??
                                                        "Not available"}
                                                </td>

                                                <td>
                                                    {application
                                                        .jobTitle ??
                                                        "Not available"}
                                                </td>

                                                <td>
                                                    <span className="hm-badge">
                                                        {normalizeStatus(
                                                            application
                                                                .status
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        application
                                                            .appliedAt
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="hm-panel">
                    <div className="hm-panel-header">
                        <h2>Upcoming Interviews</h2>

                        <span>
                            {upcomingInterviews.length}
                        </span>
                    </div>

                    {upcomingInterviews.length === 0 ? (
                        <div className="hm-empty">
                            No upcoming interviews found.
                        </div>
                    ) : (
                        <div className="hm-table-wrapper">
                            <table className="hm-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {upcomingInterviews.map(
                                        interview => (
                                            <tr
                                                key={
                                                    interview.id
                                                }
                                            >
                                                <td>
                                                    {interview
                                                        .candidateName ??
                                                        "Not available"}
                                                </td>

                                                <td>
                                                    {interview
                                                        .jobTitle ??
                                                        "Not available"}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        interview
                                                            .scheduledAt ??
                                                        interview
                                                            .interviewDate ??
                                                        interview
                                                            .startTime
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="hm-badge">
                                                        {normalizeStatus(
                                                            interview
                                                                .status
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            <section className="hm-panel">
                <div className="hm-panel-header">
                    <h2>
                        Recent Candidate Feedback
                    </h2>

                    <span>
                        {recentFeedback.length}
                    </span>
                </div>

                {recentFeedback.length === 0 ? (
                    <div className="hm-empty">
                        No candidate feedback found.
                    </div>
                ) : (
                    <div className="hm-table-wrapper">
                        <table className="hm-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Rating</th>
                                    <th>Recommendation</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentFeedback.map(
                                    feedback => (
                                        <tr key={feedback.id}>
                                            <td>
                                                {feedback
                                                    .candidateName ??
                                                    "Not available"}
                                            </td>

                                            <td>
                                                {feedback.rating ??
                                                    "Not available"}
                                            </td>

                                            <td>
                                                {feedback
                                                    .recommendation ??
                                                    "Not available"}
                                            </td>

                                            <td>
                                                {feedback.comments ??
                                                    feedback
                                                        .comment ??
                                                    "No comments"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
