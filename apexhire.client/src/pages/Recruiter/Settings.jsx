import { useEffect, useMemo, useState } from "react";

import recruiterProfileService from "../../services/recruiterProfileService";

import "./RecruiterDashboard.css";

const RECRUITER_STATUSES = [
    "UnderReview",
    "Shortlisted",
    "Rejected"
];

function normalizeStatus(status) {
    return String(status ?? "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .trim();
}

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

function getErrorMessage(error, fallbackMessage) {
    const responseData = error?.response?.data;

    if (typeof responseData?.message === "string") {
        return responseData.message;
    }

    if (Array.isArray(responseData?.errors)) {
        return responseData.errors.join(", ");
    }

    if (
        responseData?.errors &&
        typeof responseData.errors === "object"
    ) {
        const validationErrors = Object.values(
            responseData.errors
        ).flat();

        if (validationErrors.length > 0) {
            return validationErrors.join(", ");
        }
    }

    return error?.message ?? fallbackMessage;
}

function getStatusCount(applications, status) {
    return applications.filter(
        application => application.status === status
    ).length;
}

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedApplication, setSelectedApplication] =
        useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadApplications() {
            setLoading(true);
            setErrorMessage("");

            try {
                const data =
                    await recruiterProfileService
                        .getDepartmentApplications();

                if (!isMounted) {
                    return;
                }

                setApplications(
                    Array.isArray(data)
                        ? data
                        : []
                );
            }
            catch (error) {
                console.error(
                    "Unable to load applications:",
                    error
                );

                if (isMounted) {
                    setErrorMessage(
                        getErrorMessage(
                            error,
                            "Unable to load applications."
                        )
                    );
                }
            }
            finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadApplications();

        return () => {
            isMounted = false;
        };
    }, []);

    const statistics = useMemo(() => {
        return {
            total: applications.length,
            submitted: getStatusCount(
                applications,
                "Submitted"
            ),
            underReview: getStatusCount(
                applications,
                "UnderReview"
            ),
            shortlisted: getStatusCount(
                applications,
                "Shortlisted"
            ),
            rejected: getStatusCount(
                applications,
                "Rejected"
            )
        };
    }, [applications]);

    const availableStatuses = useMemo(() => {
        const statuses = applications
            .map(application => application.status)
            .filter(Boolean);

        return [
            "All",
            ...new Set(statuses)
        ];
    }, [applications]);

    const filteredApplications = useMemo(() => {
        const searchValue =
            searchText.trim().toLowerCase();

        return applications.filter(application => {
            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;

            const searchableText = [
                application.candidateName,
                application.jobTitle,
                application.organizationName,
                application.status
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !searchValue ||
                searchableText.includes(searchValue);

            return matchesStatus && matchesSearch;
        });
    }, [
        applications,
        searchText,
        statusFilter
    ]);

    async function handleStatusChange(
        application,
        newStatus
    ) {
        if (!application?.id || !newStatus) {
            return;
        }

        const confirmed = window.confirm(
            `Change ${application.candidateName}'s application status to ${normalizeStatus(newStatus)}?`
        );

        if (!confirmed) {
            return;
        }

        setUpdatingId(application.id);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const updatedApplication =
                await recruiterProfileService
                    .updateApplicationStatus(
                        application.id,
                        newStatus
                    );

            setApplications(currentApplications =>
                currentApplications.map(currentApplication =>
                    currentApplication.id === application.id
                        ? updatedApplication
                        : currentApplication
                )
            );

            setSelectedApplication(currentApplication =>
                currentApplication?.id === application.id
                    ? updatedApplication
                    : currentApplication
            );

            setSuccessMessage(
                "Application status updated successfully."
            );
        }
        catch (error) {
            console.error(
                "Unable to update application status:",
                error
            );

            setErrorMessage(
                getErrorMessage(
                    error,
                    "Unable to update application status."
                )
            );
        }
        finally {
            setUpdatingId(null);
        }
    }

    function handleCloseModal() {
        if (updatingId !== null) {
            return;
        }

        setSelectedApplication(null);
    }

    if (loading) {
        return (
            <div className="recruiter-page">
                <div className="empty-state">
                    <h2>Loading applications...</h2>

                    <p>
                        Please wait while the applications
                        are loaded.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-page">
            <div className="page-header">
                <div>
                    <h1>Applications</h1>

                    <p>
                        Review and manage applications
                        submitted to your department.
                    </p>
                </div>

                <div className="summary-badge">
                    {applications.length} application(s)
                </div>
            </div>

            {errorMessage && (
                <div
                    className="error-message"
                    role="alert"
                >
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div
                    className="success-message"
                    role="status"
                >
                    {successMessage}
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

                    <strong>
                        {statistics.underReview}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Shortlisted</span>

                    <strong>
                        {statistics.shortlisted}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Rejected</span>

                    <strong>{statistics.rejected}</strong>
                </div>
            </div>

            <div className="filter-card">
                <div className="filter-grid">
                    <div>
                        <label htmlFor="applicationSearch">
                            Search
                        </label>

                        <input
                            id="applicationSearch"
                            type="search"
                            placeholder="Candidate, job or organization"
                            value={searchText}
                            onChange={event =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="statusFilter">
                            Status
                        </label>

                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={event =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >
                            {availableStatuses.map(status => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {normalizeStatus(status)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="empty-state">
                    <h3>No applications found</h3>

                    <p>
                        No applications match your current
                        search or status filter.
                    </p>
                </div>
            ) : (
                <div className="applications-table-wrapper">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Job</th>
                                <th>Organization</th>
                                <th>Status</th>
                                <th>Applied</th>
                                <th>Match</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredApplications.map(
                                application => (
                                    <tr key={application.id}>
                                        <td>
                                            <strong>
                                                {
                                                    application
                                                        .candidateName
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {application.jobTitle ||
                                                "Not available"}
                                        </td>

                                        <td>
                                            {application
                                                .organizationName ||
                                                "Not available"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge status-${String(
                                                    application.status
                                                )
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )
                                                    .toLowerCase()}`}
                                            >
                                                {normalizeStatus(
                                                    application.status
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                application.appliedAt
                                            )}
                                        </td>

                                        <td>
                                            {application.matchScore ??
                                                0}
                                            %
                                        </td>

                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    type="button"
                                                    className="secondary-button"
                                                    onClick={() => {
                                                        setSuccessMessage(
                                                            ""
                                                        );

                                                        setSelectedApplication(
                                                            application
                                                        );
                                                    }}
                                                >
                                                    View
                                                </button>

                                                <select
                                                    aria-label={`Update ${application.candidateName} status`}
                                                    value=""
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onChange={event => {
                                                        const newStatus =
                                                            event
                                                                .target
                                                                .value;

                                                        handleStatusChange(
                                                            application,
                                                            newStatus
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        {updatingId ===
                                                            application.id
                                                            ? "Updating..."
                                                            : "Change Status"}
                                                    </option>

                                                    {RECRUITER_STATUSES
                                                        .filter(
                                                            status =>
                                                                status !==
                                                                application.status
                                                        )
                                                        .map(status => (
                                                            <option
                                                                key={
                                                                    status
                                                                }
                                                                value={
                                                                    status
                                                                }
                                                            >
                                                                {normalizeStatus(
                                                                    status
                                                                )}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedApplication && (
                <div
                    className="modal-overlay"
                    role="presentation"
                    onClick={handleCloseModal}
                >
                    <div
                        className="modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="application-details-title"
                        onClick={event =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h2 id="application-details-title">
                                    Application Details
                                </h2>

                                <p>
                                    {selectedApplication
                                        .candidateName ||
                                        "Candidate"}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="close-button"
                                aria-label="Close application details"
                                disabled={
                                    updatingId !== null
                                }
                                onClick={handleCloseModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-grid">
                            <div>
                                <span>Candidate</span>

                                <strong>
                                    {selectedApplication
                                        .candidateName ||
                                        "Not available"}
                                </strong>
                            </div>

                            <div>
                                <span>Job</span>

                                <strong>
                                    {selectedApplication
                                        .jobTitle ||
                                        "Not available"}
                                </strong>
                            </div>

                            <div>
                                <span>Organization</span>

                                <strong>
                                    {selectedApplication
                                        .organizationName ||
                                        "Not available"}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>

                                <strong>
                                    {normalizeStatus(
                                        selectedApplication.status
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Match Score</span>

                                <strong>
                                    {selectedApplication
                                        .matchScore ?? 0}
                                    %
                                </strong>
                            </div>

                            <div>
                                <span>Applied At</span>

                                <strong>
                                    {formatDate(
                                        selectedApplication
                                            .appliedAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Last Updated</span>

                                <strong>
                                    {formatDate(
                                        selectedApplication
                                            .updatedAt
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="cover-letter-section">
                            <h3>Cover Letter</h3>

                            <p>
                                {selectedApplication
                                    .coverLetter ||
                                    "No cover letter was provided."}
                            </p>
                        </div>

                        <div className="modal-actions">
                            {RECRUITER_STATUSES
                                .filter(
                                    status =>
                                        status !==
                                        selectedApplication.status
                                )
                                .map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        className={
                                            status === "Rejected"
                                                ? "danger-button"
                                                : "primary-button"
                                        }
                                        disabled={
                                            updatingId ===
                                            selectedApplication.id
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedApplication,
                                                status
                                            )
                                        }
                                    >
                                        {updatingId ===
                                            selectedApplication.id
                                            ? "Updating..."
                                            : normalizeStatus(
                                                status
                                            )}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

