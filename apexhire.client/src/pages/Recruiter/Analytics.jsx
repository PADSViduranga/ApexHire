import {
    useEffect,
    useMemo,
    useState
} from "react";

import recruiterProfileService
    from "../../services/recruiterProfileService";

import "./Analytics.css";

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.title ??
        error?.message ??
        "Unable to load analytics."
    );
}

function normalizeStatus(status) {
    return String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function getCandidateName(application) {
    return (
        application.candidateName ??
        application.candidate?.fullName ??
        application.candidate?.name ??
        "Unknown Candidate"
    );
}

function getJobTitle(application) {
    return (
        application.jobTitle ??
        application.jobPost?.title ??
        application.job?.title ??
        "Unknown Job"
    );
}

export default function Analytics() {
    const [
        applications,
        setApplications
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage
    ] = useState("");

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter
    ] = useState("All");

    useEffect(() => {
        let mounted = true;

        async function loadAnalytics() {
            setLoading(true);
            setErrorMessage("");

            try {
                const response =
                    await recruiterProfileService
                        .getDepartmentApplications();

                const data =
                    response?.data ??
                    response ??
                    [];

                if (!mounted) {
                    return;
                }

                setApplications(
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.items)
                            ? data.items
                            : []
                );
            } catch (error) {
                console.error(
                    "Unable to load analytics:",
                    error
                );

                if (mounted) {
                    setApplications([]);
                    setErrorMessage(
                        getErrorMessage(error)
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        void loadAnalytics();

        return () => {
            mounted = false;
        };
    }, []);

    const statusOptions =
        useMemo(() => {
            const statuses =
                applications
                    .map(application =>
                        application.status
                    )
                    .filter(Boolean);

            return [
                "All",
                ...new Set(statuses)
            ];
        }, [applications]);

    const filteredApplications =
        useMemo(() => {
            const search =
                searchText
                    .trim()
                    .toLowerCase();

            return applications.filter(
                application => {
                    const candidateName =
                        getCandidateName(
                            application
                        ).toLowerCase();

                    const jobTitle =
                        getJobTitle(
                            application
                        ).toLowerCase();

                    const statusMatches =
                        statusFilter === "All" ||
                        String(
                            application.status
                        ) === statusFilter;

                    const searchMatches =
                        !search ||
                        candidateName.includes(
                            search
                        ) ||
                        jobTitle.includes(
                            search
                        );

                    return (
                        searchMatches &&
                        statusMatches
                    );
                }
            );
        }, [
            applications,
            searchText,
            statusFilter
        ]);

    const statistics =
        useMemo(() => {
            const total =
                applications.length;

            const countByStatus =
                status =>
                    applications.filter(
                        application =>
                            String(
                                application.status
                            ).toLowerCase() ===
                            status.toLowerCase()
                    ).length;

            const submitted =
                countByStatus("Submitted");

            const underReview =
                applications.filter(
                    application => {
                        const status =
                            normalizeStatus(
                                application.status
                            );

                        return (
                            status ===
                                "underreview" ||
                            status ===
                                "under-review"
                        );
                    }
                ).length;

            const shortlisted =
                countByStatus("Shortlisted");

            const rejected =
                countByStatus("Rejected");

            const hired =
                countByStatus("Hired");

            const averageMatch =
                total === 0
                    ? "0.0"
                    : (
                        applications.reduce(
                            (
                                totalScore,
                                application
                            ) =>
                                totalScore +
                                Number(
                                    application
                                        .matchScore ??
                                    0
                                ),
                            0
                        ) / total
                    ).toFixed(1);

            const now =
                new Date();

            const thisMonth =
                applications.filter(
                    application => {
                        if (
                            !application.appliedAt
                        ) {
                            return false;
                        }

                        const appliedDate =
                            new Date(
                                application.appliedAt
                            );

                        if (
                            Number.isNaN(
                                appliedDate.getTime()
                            )
                        ) {
                            return false;
                        }

                        return (
                            appliedDate.getMonth() ===
                                now.getMonth() &&
                            appliedDate.getFullYear() ===
                                now.getFullYear()
                        );
                    }
                ).length;

            const conversionRate =
                total === 0
                    ? "0.0"
                    : (
                        (
                            hired / total
                        ) * 100
                    ).toFixed(1);

            return {
                total,
                submitted,
                underReview,
                shortlisted,
                rejected,
                hired,
                averageMatch,
                thisMonth,
                conversionRate
            };
        }, [applications]);

    const topCandidates =
        useMemo(() => {
            return [...applications]
                .sort(
                    (first, second) =>
                        Number(
                            second.matchScore ??
                            0
                        ) -
                        Number(
                            first.matchScore ??
                            0
                        )
                )
                .slice(0, 5);
        }, [applications]);

    if (loading) {
        return (
            <main className="recruiter-analytics-page">
                <section className="analytics-loading-card">
                    <div className="analytics-loader" />

                    <div>
                        <h2>
                            Loading analytics
                        </h2>

                        <p>
                            Preparing your recruitment
                            performance overview.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="recruiter-analytics-page">
            <header className="analytics-hero">
                <div className="analytics-hero-content">
                    <span className="analytics-eyebrow">
                        Recruiter Intelligence
                    </span>

                    <h1>
                        Recruitment Analytics
                    </h1>

                    <p>
                        Review application activity,
                        candidate quality and hiring
                        performance across your
                        department.
                    </p>
                </div>

                <div className="analytics-hero-summary">
                    <span>
                        Department Overview
                    </span>

                    <strong>
                        {statistics.total}
                    </strong>

                    <small>
                        total applications
                    </small>
                </div>
            </header>

            {errorMessage && (
                <div
                    className="analytics-alert analytics-alert-error"
                    role="alert"
                >
                    <div>
                        <strong>
                            Unable to load all data
                        </strong>

                        <span>
                            {errorMessage}
                        </span>
                    </div>
                </div>
            )}

            <section
                className="analytics-statistics"
                aria-label="Recruitment statistics"
            >
                <article className="analytics-stat-card analytics-stat-primary">
                    <div className="analytics-stat-icon">
                        01
                    </div>

                    <span>
                        Total Applications
                    </span>

                    <strong>
                        {statistics.total}
                    </strong>

                    <small>
                        All received applications
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        02
                    </div>

                    <span>
                        Submitted
                    </span>

                    <strong>
                        {statistics.submitted}
                    </strong>

                    <small>
                        Awaiting initial review
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        03
                    </div>

                    <span>
                        Under Review
                    </span>

                    <strong>
                        {statistics.underReview}
                    </strong>

                    <small>
                        Currently being evaluated
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        04
                    </div>

                    <span>
                        Shortlisted
                    </span>

                    <strong>
                        {statistics.shortlisted}
                    </strong>

                    <small>
                        Selected for next stage
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        05
                    </div>

                    <span>
                        Hired
                    </span>

                    <strong>
                        {statistics.hired}
                    </strong>

                    <small>
                        Successful placements
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        06
                    </div>

                    <span>
                        Rejected
                    </span>

                    <strong>
                        {statistics.rejected}
                    </strong>

                    <small>
                        Applications not selected
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        07
                    </div>

                    <span>
                        Average Match
                    </span>

                    <strong>
                        {statistics.averageMatch}%
                    </strong>

                    <small>
                        Average candidate match score
                    </small>
                </article>

                <article className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        08
                    </div>

                    <span>
                        This Month
                    </span>

                    <strong>
                        {statistics.thisMonth}
                    </strong>

                    <small>
                        Applications received this month
                    </small>
                </article>
            </section>

            <section className="analytics-toolbar">
                <div className="analytics-toolbar-heading">
                    <span>
                        Application Explorer
                    </span>

                    <h2>
                        Candidate activity
                    </h2>

                    <p>
                        Search and filter department
                        applications.
                    </p>
                </div>

                <div className="analytics-filter-controls">
                    <label className="analytics-field">
                        <span>
                            Search
                        </span>

                        <input
                            type="search"
                            placeholder="Candidate or job title"
                            value={searchText}
                            onChange={event =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label className="analytics-field">
                        <span>
                            Status
                        </span>

                        <select
                            value={statusFilter}
                            onChange={event =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >
                            {statusOptions.map(
                                status => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                )
                            )}
                        </select>
                    </label>
                </div>
            </section>

            <section className="analytics-content-grid">
                <article className="analytics-panel analytics-applications-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <span>
                                Applications
                            </span>

                            <h2>
                                Recent Applications
                            </h2>
                        </div>

                        <div className="analytics-result-count">
                            {
                                filteredApplications
                                    .length
                            }
                            <small>
                                results
                            </small>
                        </div>
                    </div>

                    {filteredApplications.length ===
                    0 ? (
                        <div className="analytics-empty-state">
                            <div className="analytics-empty-icon">
                                0
                            </div>

                            <h3>
                                No applications found
                            </h3>

                            <p>
                                Try changing your search
                                term or selected status.
                            </p>
                        </div>
                    ) : (
                        <div className="analytics-table-wrapper">
                            <table className="analytics-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Candidate
                                        </th>

                                        <th>
                                            Job
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Match
                                        </th>

                                        <th>
                                            Applied
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredApplications.map(
                                        (
                                            application,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    application.id ??
                                                    `${getCandidateName(
                                                        application
                                                    )}-${index}`
                                                }
                                            >
                                                <td>
                                                    <div className="candidate-cell">
                                                        <span className="candidate-avatar">
                                                            {getCandidateName(
                                                                application
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </span>

                                                        <strong>
                                                            {getCandidateName(
                                                                application
                                                            )}
                                                        </strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    {getJobTitle(
                                                        application
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`analytics-status analytics-status-${normalizeStatus(
                                                            application.status
                                                        )}`}
                                                    >
                                                        {
                                                            application.status ??
                                                            "Unknown"
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="match-score">
                                                        <strong>
                                                            {
                                                                application.matchScore ??
                                                                0
                                                            }
                                                            %
                                                        </strong>

                                                        <div className="match-score-track">
                                                            <span
                                                                style={{
                                                                    width: `${Math.min(
                                                                        100,
                                                                        Math.max(
                                                                            0,
                                                                            Number(
                                                                                application.matchScore ??
                                                                                0
                                                                            )
                                                                        )
                                                                    )}%`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
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
                        </div>
                    )}
                </article>

                <aside className="analytics-side-column">
                    <article className="analytics-panel">
                        <div className="analytics-panel-header">
                            <div>
                                <span>
                                    Candidate Ranking
                                </span>

                                <h2>
                                    Top Candidates
                                </h2>
                            </div>
                        </div>

                        {topCandidates.length === 0 ? (
                            <div className="analytics-empty-state analytics-empty-compact">
                                <h3>
                                    No candidate data
                                </h3>

                                <p>
                                    Candidate ranking will
                                    appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="top-candidate-list">
                                {topCandidates.map(
                                    (
                                        candidate,
                                        index
                                    ) => (
                                        <div
                                            className="top-candidate-item"
                                            key={
                                                candidate.id ??
                                                `${getCandidateName(
                                                    candidate
                                                )}-${index}`
                                            }
                                        >
                                            <span className="candidate-rank">
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <div className="top-candidate-details">
                                                <strong>
                                                    {getCandidateName(
                                                        candidate
                                                    )}
                                                </strong>

                                                <span>
                                                    {getJobTitle(
                                                        candidate
                                                    )}
                                                </span>
                                            </div>

                                            <span className="top-candidate-score">
                                                {
                                                    candidate.matchScore ??
                                                    0
                                                }
                                                %
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </article>

                    <article className="analytics-conversion-card">
                        <span>
                            Hiring Conversion
                        </span>

                        <strong>
                            {
                                statistics
                                    .conversionRate
                            }
                            %
                        </strong>

                        <p>
                            Percentage of applications
                            that resulted in successful
                            hires.
                        </p>

                        <div className="conversion-progress">
                            <span
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Number(
                                            statistics
                                                .conversionRate
                                        )
                                    )}%`
                                }}
                            />
                        </div>
                    </article>
                </aside>
            </section>
        </main>
    );
}
