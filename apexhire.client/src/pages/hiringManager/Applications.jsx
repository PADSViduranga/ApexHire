import { useCallback, useEffect, useMemo, useState } from "react";
import hiringManagerService from "../../services/hiringManagerService";
import "../../styles/HiringManagerApplications.css";

const APPLICATION_STATUSES = [
    "All",
    "Submitted",
    "UnderReview",
    "Shortlisted",
    "InterviewScheduled",
    "Offered",
    "Hired",
    "Rejected"
];

const MANAGER_STATUSES = [
    "InterviewScheduled",
    "Offered",
    "Hired",
    "Rejected"
];

const EMPTY_INTERVIEW_FORM = {
    applicationId: "",
    scheduledAt: "",
    interviewType: "Online",
    location: "",
    meetingLink: "",
    notes: ""
};

function unwrapResponse(response) {
    return response?.data?.data ?? response?.data ?? response ?? [];
}

function toArray(value) {
    return Array.isArray(value) ? value : [];
}

function getErrorMessage(error) {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        const errors = Object.values(data.errors)
            .flat()
            .filter(Boolean);

        if (errors.length > 0) {
            return errors.join(" ");
        }
    }

    return error?.message ?? "Something went wrong. Please try again.";
}

function normalizeStatus(status) {
    return String(status ?? "Unknown")
        .replace(/[_-]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();
}

function statusKey(status) {
    return normalizeStatus(status).toLowerCase().replace(/\s/g, "");
}

function formatDate(value) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function formatDateTime(value) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getApplicationId(application) {
    return application?.id ?? application?.applicationId ?? null;
}

function getCandidateName(application) {
    return (
        application?.candidateName ??
        application?.candidateFullName ??
        application?.candidate?.fullName ??
        application?.candidate?.name ??
        application?.user?.fullName ??
        "Unknown candidate"
    );
}

function getCandidateEmail(application) {
    return (
        application?.candidateEmail ??
        application?.email ??
        application?.candidate?.email ??
        application?.user?.email ??
        "Not available"
    );
}

function getCandidatePhone(application) {
    return (
        application?.candidatePhone ??
        application?.phoneNumber ??
        application?.candidate?.phoneNumber ??
        application?.candidate?.phone ??
        "Not available"
    );
}

function getJobTitle(application) {
    return (
        application?.jobTitle ??
        application?.job?.title ??
        application?.jobPost?.title ??
        "Unknown job"
    );
}

function getStatus(application) {
    return application?.status ?? application?.applicationStatus ?? "Submitted";
}

function getAppliedDate(application) {
    return (
        application?.appliedAt ??
        application?.applicationDate ??
        application?.createdAt ??
        application?.submittedAt ??
        null
    );
}

function getMatchScore(application) {
    const raw =
        application?.matchScore ??
        application?.matchingScore ??
        application?.score;

    if (raw === null || raw === undefined || raw === "") {
        return null;
    }

    const score = Number(raw);
    return Number.isFinite(score) ? score : null;
}

function getOrganizationName(application) {
    return (
        application?.organizationName ??
        application?.job?.organizationName ??
        application?.jobPost?.organizationName ??
        ""
    );
}

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
    const [schedulingInterview, setSchedulingInterview] = useState(false);
    const [interviewForm, setInterviewForm] = useState(EMPTY_INTERVIEW_FORM);

    const loadApplications = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response =
                await hiringManagerService.getDepartmentApplications();

            setApplications(toArray(unwrapResponse(response)));
        } catch (error) {
            console.error("Failed to load applications:", error);
            setApplications([]);
            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    useEffect(() => {
        if (!successMessage) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);

        return () => window.clearTimeout(timer);
    }, [successMessage]);

    const statistics = useMemo(() => {
        const count = status =>
            applications.filter(
                application => statusKey(getStatus(application)) === statusKey(status)
            ).length;

        return {
            total: applications.length,
            submitted: count("Submitted"),
            underReview: count("UnderReview"),
            shortlisted: count("Shortlisted"),
            interviewScheduled: count("InterviewScheduled"),
            offered: count("Offered"),
            hired: count("Hired"),
            rejected: count("Rejected")
        };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        const filtered = applications.filter(application => {
            const candidateName = getCandidateName(application).toLowerCase();
            const candidateEmail = getCandidateEmail(application).toLowerCase();
            const jobTitle = getJobTitle(application).toLowerCase();

            const matchesSearch =
                !query ||
                candidateName.includes(query) ||
                candidateEmail.includes(query) ||
                jobTitle.includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                statusKey(getStatus(application)) === statusKey(statusFilter);

            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((first, second) => {
            if (sortOrder === "candidate") {
                return getCandidateName(first).localeCompare(
                    getCandidateName(second)
                );
            }

            const firstDate = new Date(getAppliedDate(first) ?? 0).getTime();
            const secondDate = new Date(getAppliedDate(second) ?? 0).getTime();

            return sortOrder === "oldest"
                ? firstDate - secondDate
                : secondDate - firstDate;
        });
    }, [applications, searchText, statusFilter, sortOrder]);

    function clearFilters() {
        setSearchText("");
        setStatusFilter("All");
        setSortOrder("latest");
    }

    function openDetailsModal(application) {
        setSelectedApplication(application);
        setShowDetailsModal(true);
    }

    function closeDetailsModal() {
        setShowDetailsModal(false);
        setSelectedApplication(null);
    }

    function openInterviewModal(application) {
        const applicationId = getApplicationId(application);

        setSelectedApplication(application);
        setInterviewForm({
            ...EMPTY_INTERVIEW_FORM,
            applicationId: applicationId ?? ""
        });
        setShowInterviewModal(true);
    }

    function closeInterviewModal() {
        if (schedulingInterview) {
            return;
        }

        setShowInterviewModal(false);
        setSelectedApplication(null);
        setInterviewForm(EMPTY_INTERVIEW_FORM);
    }

    function handleInterviewInputChange(event) {
        const { name, value } = event.target;

        setInterviewForm(current => ({
            ...current,
            [name]: value
        }));
    }

    async function handleStatusUpdate(application, nextStatus) {
        const applicationId = getApplicationId(application);

        if (!applicationId) {
            setErrorMessage("The application ID is missing.");
            return;
        }

        if (statusKey(getStatus(application)) === statusKey(nextStatus)) {
            return;
        }

        const confirmed = window.confirm(
            `Change ${getCandidateName(application)}'s status to ${normalizeStatus(
                nextStatus
            )}?`
        );

        if (!confirmed) {
            return;
        }

        setUpdatingApplicationId(applicationId);
        setErrorMessage("");

        try {
            await hiringManagerService.updateApplicationStatus(
                applicationId,
                nextStatus
            );

            setApplications(current =>
                current.map(item =>
                    getApplicationId(item) === applicationId
                        ? {
                              ...item,
                              status: nextStatus,
                              applicationStatus: nextStatus
                          }
                        : item
                )
            );

            setSelectedApplication(current =>
                current && getApplicationId(current) === applicationId
                    ? {
                          ...current,
                          status: nextStatus,
                          applicationStatus: nextStatus
                      }
                    : current
            );

            setSuccessMessage(
                `Application status changed to ${normalizeStatus(nextStatus)}.`
            );
        } catch (error) {
            console.error("Failed to update application status:", error);
            setErrorMessage(getErrorMessage(error));
        } finally {
            setUpdatingApplicationId(null);
        }
    }

    async function handleScheduleInterview(event) {
        event.preventDefault();

        const applicationId =
            interviewForm.applicationId ||
            getApplicationId(selectedApplication);

        if (!applicationId) {
            setErrorMessage("The application ID is missing.");
            return;
        }

        if (!interviewForm.scheduledAt) {
            setErrorMessage("Select an interview date and time.");
            return;
        }

        const scheduledDate = new Date(interviewForm.scheduledAt);

        if (
            Number.isNaN(scheduledDate.getTime()) ||
            scheduledDate.getTime() <= Date.now()
        ) {
            setErrorMessage("Choose a valid future interview date and time.");
            return;
        }

        if (
            interviewForm.interviewType === "Online" &&
            !interviewForm.meetingLink.trim()
        ) {
            setErrorMessage("Enter a meeting link for an online interview.");
            return;
        }

        if (
            interviewForm.interviewType === "InPerson" &&
            !interviewForm.location.trim()
        ) {
            setErrorMessage("Enter a location for an in-person interview.");
            return;
        }

        setSchedulingInterview(true);
        setErrorMessage("");

        try {
            const payload = {
                applicationId: Number(applicationId),
                scheduledAt: scheduledDate.toISOString(),
                interviewType: interviewForm.interviewType,
                location: interviewForm.location.trim() || null,
                meetingLink: interviewForm.meetingLink.trim() || null,
                notes: interviewForm.notes.trim() || null
            };

            await hiringManagerService.scheduleInterview(payload);

            try {
                await hiringManagerService.updateApplicationStatus(
                    applicationId,
                    "InterviewScheduled"
                );
            } catch (statusError) {
                console.warn(
                    "Interview created, but application status update failed:",
                    statusError
                );
            }

            setApplications(current =>
                current.map(application =>
                    getApplicationId(application) === applicationId
                        ? {
                              ...application,
                              status: "InterviewScheduled",
                              applicationStatus: "InterviewScheduled"
                          }
                        : application
                )
            );

            setSuccessMessage(
                `Interview scheduled for ${getCandidateName(
                    selectedApplication
                )}.`
            );

            setShowInterviewModal(false);
            setSelectedApplication(null);
            setInterviewForm(EMPTY_INTERVIEW_FORM);
        } catch (error) {
            console.error("Failed to schedule interview:", error);
            setErrorMessage(getErrorMessage(error));
        } finally {
            setSchedulingInterview(false);
        }
    }

    return (
        <section className="hm-applications-page">
            <header className="hm-page-header">
                <div>
                    <p className="hm-page-eyebrow">Hiring Manager</p>
                    <h1>Applications</h1>
                    <p className="hm-page-description">
                        Review candidates, update hiring decisions, and schedule
                        interviews.
                    </p>
                </div>

                <button
                    type="button"
                    className="hm-refresh-button"
                    onClick={loadApplications}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {successMessage && (
                <div className="hm-alert hm-alert-success" role="status">
                    <span>{successMessage}</span>
                    <button
                        type="button"
                        className="hm-alert-close"
                        onClick={() => setSuccessMessage("")}
                        aria-label="Close success message"
                    >
                        ×
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="hm-alert hm-alert-error" role="alert">
                    <div>
                        <strong>Something went wrong</strong>
                        <p>{errorMessage}</p>
                    </div>
                    <button
                        type="button"
                        className="hm-alert-retry"
                        onClick={loadApplications}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="hm-statistics-grid">
                {[
                    ["Total Applications", statistics.total],
                    ["Submitted", statistics.submitted],
                    ["Under Review", statistics.underReview],
                    ["Shortlisted", statistics.shortlisted],
                    ["Interviews", statistics.interviewScheduled],
                    ["Offered", statistics.offered],
                    ["Hired", statistics.hired],
                    ["Rejected", statistics.rejected]
                ].map(([label, value]) => (
                    <article className="hm-stat-card" key={label}>
                        <span className="hm-stat-label">{label}</span>
                        <strong className="hm-stat-value">{value}</strong>
                    </article>
                ))}
            </div>

            <section className="hm-panel hm-filter-panel">
                <div className="hm-panel-header">
                    <div>
                        <h2>Find Applications</h2>
                        <p>Search candidates and filter the results.</p>
                    </div>

                    <button
                        type="button"
                        className="hm-clear-filter-button"
                        onClick={clearFilters}
                        disabled={
                            !searchText &&
                            statusFilter === "All" &&
                            sortOrder === "latest"
                        }
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="hm-filter-grid">
                    <div className="hm-form-group hm-search-group">
                        <label htmlFor="application-search">Search</label>
                        <input
                            id="application-search"
                            type="search"
                            value={searchText}
                            onChange={event => setSearchText(event.target.value)}
                            placeholder="Candidate name, email, or job title"
                        />
                    </div>

                    <div className="hm-form-group">
                        <label htmlFor="status-filter">Status</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={event => setStatusFilter(event.target.value)}
                        >
                            {APPLICATION_STATUSES.map(status => (
                                <option key={status} value={status}>
                                    {normalizeStatus(status)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="hm-form-group">
                        <label htmlFor="sort-order">Sort By</label>
                        <select
                            id="sort-order"
                            value={sortOrder}
                            onChange={event => setSortOrder(event.target.value)}
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="candidate">Candidate Name</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="hm-panel hm-applications-panel">
                <div className="hm-panel-header">
                    <div>
                        <h2>Department Applications</h2>
                        <p>
                            Showing {filteredApplications.length} of{" "}
                            {applications.length} applications.
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="hm-state">
                        <div className="hm-loading-spinner" />
                        <h3>Loading applications</h3>
                    </div>
                )}

                {!loading && !errorMessage && applications.length === 0 && (
                    <div className="hm-state">
                        <h3>No applications yet</h3>
                        <p>
                            Department applications will appear here when they
                            are submitted.
                        </p>
                    </div>
                )}

                {!loading &&
                    !errorMessage &&
                    applications.length > 0 &&
                    filteredApplications.length === 0 && (
                        <div className="hm-state">
                            <h3>No matching applications</h3>
                            <p>Try changing the search or status filter.</p>
                            <button
                                type="button"
                                className="hm-secondary-button"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                {!loading &&
                    !errorMessage &&
                    filteredApplications.length > 0 && (
                        <div className="hm-table-wrapper">
                            <table className="hm-applications-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job</th>
                                        <th>Match</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredApplications.map(application => {
                                        const applicationId =
                                            getApplicationId(application);
                                        const candidateName =
                                            getCandidateName(application);
                                        const status = getStatus(application);
                                        const matchScore =
                                            getMatchScore(application);
                                        const isUpdating =
                                            updatingApplicationId ===
                                            applicationId;

                                        return (
                                            <tr
                                                key={
                                                    applicationId ??
                                                    `${getCandidateEmail(
                                                        application
                                                    )}-${getJobTitle(application)}`
                                                }
                                            >
                                                <td>
                                                    <div className="hm-candidate-cell">
                                                        <div className="hm-candidate-avatar">
                                                            {candidateName
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                {candidateName}
                                                            </strong>
                                                            <span>
                                                                {getCandidateEmail(
                                                                    application
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {getJobTitle(application)}
                                                    </strong>
                                                    {getOrganizationName(
                                                        application
                                                    ) && (
                                                        <span className="hm-secondary-text">
                                                            {getOrganizationName(
                                                                application
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {matchScore === null
                                                        ? "Not scored"
                                                        : `${matchScore}%`}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`hm-status-badge hm-status-${statusKey(
                                                            status
                                                        )}`}
                                                    >
                                                        {normalizeStatus(status)}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        getAppliedDate(application)
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="hm-table-actions">
                                                        <button
                                                            type="button"
                                                            className="hm-icon-button"
                                                            onClick={() =>
                                                                openDetailsModal(
                                                                    application
                                                                )
                                                            }
                                                            disabled={isUpdating}
                                                            title="View application"
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="hm-icon-button"
                                                            onClick={() =>
                                                                openInterviewModal(
                                                                    application
                                                                )
                                                            }
                                                            disabled={
                                                                isUpdating ||
                                                                ["rejected", "hired"].includes(
                                                                    statusKey(status)
                                                                )
                                                            }
                                                            title="Schedule interview"
                                                        >
                                                            Interview
                                                        </button>

                                                        <select
                                                            className="hm-status-select"
                                                            value=""
                                                            onChange={event => {
                                                                if (
                                                                    event.target
                                                                        .value
                                                                ) {
                                                                    handleStatusUpdate(
                                                                        application,
                                                                        event.target
                                                                            .value
                                                                    );
                                                                }
                                                            }}
                                                            disabled={
                                                                isUpdating ||
                                                                !applicationId
                                                            }
                                                        >
                                                            <option value="">
                                                                Update Status
                                                            </option>
                                                            {MANAGER_STATUSES.map(
                                                                nextStatus => (
                                                                    <option
                                                                        key={
                                                                            nextStatus
                                                                        }
                                                                        value={
                                                                            nextStatus
                                                                        }
                                                                        disabled={
                                                                            statusKey(
                                                                                nextStatus
                                                                            ) ===
                                                                            statusKey(
                                                                                status
                                                                            )
                                                                        }
                                                                    >
                                                                        {normalizeStatus(
                                                                            nextStatus
                                                                        )}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
            </section>

            {showDetailsModal && selectedApplication && (
                <div
                    className="hm-modal-overlay"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            closeDetailsModal();
                        }
                    }}
                >
                    <div className="hm-modal" role="dialog" aria-modal="true">
                        <div className="hm-modal-header">
                            <div>
                                <p className="hm-page-eyebrow">
                                    Candidate Application
                                </p>
                                <h2>
                                    {getCandidateName(selectedApplication)}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="hm-modal-close"
                                onClick={closeDetailsModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="hm-modal-body">
                            <div className="hm-details-grid">
                                <div>
                                    <span>Email</span>
                                    <strong>
                                        {getCandidateEmail(selectedApplication)}
                                    </strong>
                                </div>
                                <div>
                                    <span>Phone</span>
                                    <strong>
                                        {getCandidatePhone(selectedApplication)}
                                    </strong>
                                </div>
                                <div>
                                    <span>Job</span>
                                    <strong>
                                        {getJobTitle(selectedApplication)}
                                    </strong>
                                </div>
                                <div>
                                    <span>Applied</span>
                                    <strong>
                                        {formatDateTime(
                                            getAppliedDate(selectedApplication)
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>Status</span>
                                    <strong>
                                        {normalizeStatus(
                                            getStatus(selectedApplication)
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>Match Score</span>
                                    <strong>
                                        {getMatchScore(selectedApplication) ===
                                        null
                                            ? "Not scored"
                                            : `${getMatchScore(
                                                  selectedApplication
                                              )}%`}
                                    </strong>
                                </div>
                            </div>

                            <div className="hm-detail-section">
                                <h3>Skills</h3>
                                <p>
                                    {Array.isArray(
                                        selectedApplication.skills
                                    )
                                        ? selectedApplication.skills.join(", ")
                                        : selectedApplication.candidateSkills ??
                                          selectedApplication.skillsText ??
                                          "No skills information provided."}
                                </p>
                            </div>

                            <div className="hm-detail-section">
                                <h3>Experience</h3>
                                <p>
                                    {selectedApplication.experience ??
                                        selectedApplication.candidateExperience ??
                                        selectedApplication.experienceSummary ??
                                        "No experience information provided."}
                                </p>
                            </div>

                            <div className="hm-detail-section">
                                <h3>Education</h3>
                                <p>
                                    {selectedApplication.education ??
                                        selectedApplication.candidateEducation ??
                                        selectedApplication.educationSummary ??
                                        "No education information provided."}
                                </p>
                            </div>

                            <div className="hm-detail-section">
                                <h3>Cover Letter</h3>
                                <p>
                                    {selectedApplication.coverLetter ??
                                        selectedApplication.coverLetterText ??
                                        "No cover letter was submitted."}
                                </p>
                            </div>
                        </div>

                        <div className="hm-modal-footer">
                            <button
                                type="button"
                                className="hm-secondary-button"
                                onClick={closeDetailsModal}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="hm-primary-button"
                                onClick={() => {
                                    const application = selectedApplication;
                                    closeDetailsModal();
                                    openInterviewModal(application);
                                }}
                            >
                                Schedule Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInterviewModal && selectedApplication && (
                <div
                    className="hm-modal-overlay"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            closeInterviewModal();
                        }
                    }}
                >
                    <div className="hm-modal" role="dialog" aria-modal="true">
                        <div className="hm-modal-header">
                            <div>
                                <p className="hm-page-eyebrow">
                                    Interview Management
                                </p>
                                <h2>Schedule Interview</h2>
                                <p>
                                    {getCandidateName(selectedApplication)} —{" "}
                                    {getJobTitle(selectedApplication)}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="hm-modal-close"
                                onClick={closeInterviewModal}
                                disabled={schedulingInterview}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleScheduleInterview}>
                            <div className="hm-modal-body">
                                <div className="hm-form-grid">
                                    <div className="hm-form-group hm-form-group-full">
                                        <label htmlFor="scheduledAt">
                                            Interview Date and Time
                                        </label>
                                        <input
                                            id="scheduledAt"
                                            name="scheduledAt"
                                            type="datetime-local"
                                            value={interviewForm.scheduledAt}
                                            onChange={
                                                handleInterviewInputChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="hm-form-group">
                                        <label htmlFor="interviewType">
                                            Interview Type
                                        </label>
                                        <select
                                            id="interviewType"
                                            name="interviewType"
                                            value={interviewForm.interviewType}
                                            onChange={
                                                handleInterviewInputChange
                                            }
                                        >
                                            <option value="Online">
                                                Online
                                            </option>
                                            <option value="InPerson">
                                                In Person
                                            </option>
                                            <option value="Phone">Phone</option>
                                            <option value="Technical">
                                                Technical
                                            </option>
                                            <option value="HR">
                                                HR Interview
                                            </option>
                                        </select>
                                    </div>

                                    <div className="hm-form-group">
                                        <label htmlFor="location">
                                            Location
                                        </label>
                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            value={interviewForm.location}
                                            onChange={
                                                handleInterviewInputChange
                                            }
                                            placeholder="Office or room"
                                        />
                                    </div>

                                    <div className="hm-form-group hm-form-group-full">
                                        <label htmlFor="meetingLink">
                                            Meeting Link
                                        </label>
                                        <input
                                            id="meetingLink"
                                            name="meetingLink"
                                            type="url"
                                            value={interviewForm.meetingLink}
                                            onChange={
                                                handleInterviewInputChange
                                            }
                                            placeholder="https://meet.example.com/..."
                                        />
                                    </div>

                                    <div className="hm-form-group hm-form-group-full">
                                        <label htmlFor="notes">Notes</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows="4"
                                            value={interviewForm.notes}
                                            onChange={
                                                handleInterviewInputChange
                                            }
                                            placeholder="Interview instructions"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="hm-modal-footer">
                                <button
                                    type="button"
                                    className="hm-secondary-button"
                                    onClick={closeInterviewModal}
                                    disabled={schedulingInterview}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="hm-primary-button"
                                    disabled={schedulingInterview}
                                >
                                    {schedulingInterview
                                        ? "Scheduling..."
                                        : "Schedule Interview"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
