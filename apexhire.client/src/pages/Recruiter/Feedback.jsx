import { useEffect, useMemo, useState } from "react";

import recruiterProfileService from "../../services/recruiterProfileService";

import "./Feedback.css";

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString();
}

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ??
        error?.message ??
        "Unable to load analytics."
    );
}

export default function Analytics() {
    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [searchText, setSearchText] =
        useState("");

    useEffect(() => {
        let mounted = true;

        async function loadAnalytics() {
            try {
                setLoading(true);

                const data =
                    await recruiterProfileService
                        .getDepartmentApplications();

                if (!mounted) {
                    return;
                }

                setApplications(
                    Array.isArray(data)
                        ? data
                        : data.data ?? []
                );
            }
            catch (error) {
                console.error(error);

                if (mounted) {
                    setErrorMessage(
                        getErrorMessage(error)
                    );
                }
            }
            finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadAnalytics();

        return () => {
            mounted = false;
        };
    }, []);

    const filteredApplications =
        useMemo(() => {
            const search =
                searchText.toLowerCase();

            return applications.filter(
                application => {
                    return (
                        String(
                            application.candidateName ??
                            application.candidate?.fullName ??
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            application.jobTitle ??
                            application.jobPost?.title ??
                            ""
                        )
                            .toLowerCase()
                            .includes(search)
                    );
                }
            );
        }, [
            applications,
            searchText
        ]);

    const statistics =
        useMemo(() => {
            const total =
                applications.length;

            const submitted =
                applications.filter(
                    x =>
                        x.status === "Submitted"
                ).length;

            const underReview =
                applications.filter(
                    x =>
                        x.status === "UnderReview"
                ).length;

            const shortlisted =
                applications.filter(
                    x =>
                        x.status === "Shortlisted"
                ).length;

            const rejected =
                applications.filter(
                    x =>
                        x.status === "Rejected"
                ).length;

            const hired =
                applications.filter(
                    x =>
                        x.status === "Hired"
                ).length;

            const averageMatch =
                total === 0
                    ? 0
                    : (
                        applications.reduce(
                            (sum, x) =>
                                sum +
                                (x.matchScore ?? 0),
                            0
                        ) / total
                    ).toFixed(1);

            const thisMonth =
                applications.filter(x => {
                    if (!x.appliedAt) {
                        return false;
                    }

                    const date =
                        new Date(x.appliedAt);

                    const now =
                        new Date();

                    return (
                        date.getMonth() ===
                        now.getMonth()

                        &&

                        date.getFullYear() ===
                        now.getFullYear()
                    );
                }).length;

            return {
                total,
                submitted,
                underReview,
                shortlisted,
                rejected,
                hired,
                averageMatch,
                thisMonth
            };
        }, [applications]);

    const topCandidates =
        useMemo(() => {
            return [...applications]
                .sort(
                    (a, b) =>
                        (b.matchScore ?? 0) -
                        (a.matchScore ?? 0)
                )
                .slice(0, 5);
        }, [applications]);

    if (loading) {
        return (
            <div className="recruiter-page">
                <div className="empty-state">
                    <h2>
                        Loading analytics...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-page">
            <div className="page-header">
                <div>
                    <h1>
                        Recruitment Analytics
                    </h1>

                    <p>
                        Recruitment performance
                        overview for your department.
                    </p>
                </div>
            </div>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <div className="dashboard-statistics">
                <div className="stat-card">
                    <span>Total Applications</span>
                    <strong>{statistics.total}</strong>
                </div>

                <div className="stat-card">
                    <span>Submitted</span>
                    <strong>{statistics.submitted}</strong>
                </div>

                <div className="stat-card">
                    <span>Under Review</span>
                    <strong>{statistics.underReview}</strong>
                </div>

                <div className="stat-card">
                    <span>Shortlisted</span>
                    <strong>{statistics.shortlisted}</strong>
                </div>

                <div className="stat-card">
                    <span>Rejected</span>
                    <strong>{statistics.rejected}</strong>
                </div>

                <div className="stat-card">
                    <span>Hired</span>
                    <strong>{statistics.hired}</strong>
                </div>

                <div className="stat-card">
                    <span>Average Match</span>
                    <strong>
                        {statistics.averageMatch}%
                    </strong>
                </div>

                <div className="stat-card">
                    <span>This Month</span>
                    <strong>{statistics.thisMonth}</strong>
                </div>
            </div>

            <div className="filter-card">
                <div className="filter-grid">
                    <div>
                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Candidate or Job..."
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-panel">
                    <h2>
                        Recent Applications
                    </h2>

                    {filteredApplications.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Applications</h3>

                            <p>
                                Nothing to display.
                            </p>
                        </div>
                    ) : (
                        <table className="applications-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Job</th>
                                    <th>Status</th>
                                    <th>Match</th>
                                    <th>Applied</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredApplications.map(
                                    application => (
                                        <tr key={application.id}>
                                            <td>
                                                {application.candidateName ??
                                                    application.candidate?.fullName ??
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {application.jobTitle ??
                                                    application.jobPost?.title ??
                                                    "N/A"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge status-${String(
                                                        application.status
                                                    ).toLowerCase()}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </td>

                                            <td>
                                                {application.matchScore ?? 0}%
                                            </td>

                                            <td>
                                                {formatDate(
                                                    application.appliedAt
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="dashboard-panel">
                    <h2>
                        Top Candidates
                    </h2>

                    {topCandidates.length === 0 ? (
                        <p>
                            No candidate data available.
                        </p>
                    ) : (
                        <table className="applications-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Match</th>
                                </tr>
                            </thead>

                            <tbody>
                                {topCandidates.map(
                                    candidate => (
                                        <tr key={candidate.id}>
                                            <td>
                                                {candidate.candidateName ??
                                                    candidate.candidate?.fullName ??
                                                    "N/A"}
                                            </td>

                                            <td>
                                                <strong>
                                                    {candidate.matchScore ?? 0}%
                                                </strong>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
