import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import jobService
    from "../../services/jobService";

import "./Jobs.css";

export default function Jobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [
        processingJobId,
        setProcessingJobId,
    ] = useState(null);

    const [search, setSearch] =
        useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("All");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchJobs() {
            setLoading(true);
            setErrorMessage("");

            try {
                const response =
                    await jobService
                        .getMyJobs();

                const data =
                    response?.data ??
                    response;

                if (isMounted) {
                    setJobs(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load jobs:",
                    error
                );

                if (isMounted) {
                    const apiMessage =
                        error?.response
                            ?.data?.message ||
                        error?.response
                            ?.data?.title ||
                        error?.response
                            ?.data ||
                        "Unable to load jobs.";

                    setErrorMessage(
                        typeof apiMessage ===
                            "string"
                            ? apiMessage
                            : "Unable to load jobs."
                    );

                    setJobs([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void fetchJobs();

        return () => {
            isMounted = false;
        };
    }, []);

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    async function handleDeleteJob(jobId) {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmed) {
            return;
        }

        clearMessages();
        setProcessingJobId(jobId);

        try {
            await jobService
                .deleteJob(jobId);

            setJobs(
                (currentJobs) =>
                    currentJobs.filter(
                        (job) =>
                            job.id !== jobId
                    )
            );

            setSuccessMessage(
                "Job deleted successfully."
            );
        } catch (error) {
            console.error(
                "Failed to delete job:",
                error
            );

            const apiMessage =
                error?.response
                    ?.data?.message ||
                error?.response
                    ?.data?.title ||
                error?.response
                    ?.data ||
                "Unable to delete the job.";

            setErrorMessage(
                typeof apiMessage ===
                    "string"
                    ? apiMessage
                    : "Unable to delete the job."
            );
        } finally {
            setProcessingJobId(null);
        }
    }

    async function handleChangeStatus(job) {
        const currentStatus =
            job.status ?? "Active";

        const newStatus =
            currentStatus === "Active"
                ? "Closed"
                : "Active";

        clearMessages();
        setProcessingJobId(job.id);

        try {
            await jobService
                .updateJobStatus(
                    job.id,
                    newStatus
                );

            setJobs(
                (currentJobs) =>
                    currentJobs.map(
                        (currentJob) =>
                            currentJob.id ===
                            job.id
                                ? {
                                    ...currentJob,
                                    status:
                                        newStatus,
                                }
                                : currentJob
                    )
            );

            setSuccessMessage(
                `Job status changed to ${newStatus}.`
            );
        } catch (error) {
            console.error(
                "Failed to update job status:",
                error
            );

            const apiMessage =
                error?.response
                    ?.data?.message ||
                error?.response
                    ?.data?.title ||
                error?.response
                    ?.data ||
                "Unable to update the job status.";

            setErrorMessage(
                typeof apiMessage ===
                    "string"
                    ? apiMessage
                    : "Unable to update the job status."
            );
        } finally {
            setProcessingJobId(null);
        }
    }

    function formatEmploymentType(value) {
        if (!value) {
            return "Not specified";
        }

        const employmentTypes = {
            FullTime: "Full Time",
            PartTime: "Part Time",
            Contract: "Contract",
            Internship: "Internship",
        };

        return (
            employmentTypes[value] ??
            value
        );
    }

    function formatSalary(value) {
        const numberValue =
            Number(value);

        if (
            value === null ||
            value === undefined ||
            value === "" ||
            Number.isNaN(numberValue)
        ) {
            return "Not specified";
        }

        return numberValue
            .toLocaleString(
                "en-LK",
                {
                    minimumFractionDigits:
                        0,

                    maximumFractionDigits:
                        2,
                }
            );
    }

    function getStatusClass(status) {
        switch (status) {
            case "Active":
                return "jobs-status jobs-status--active";

            case "Closed":
                return "jobs-status jobs-status--closed";

            case "Draft":
                return "jobs-status jobs-status--draft";

            default:
                return "jobs-status jobs-status--closed";
        }
    }

    const filteredJobs =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return jobs.filter(
                (job) => {
                    const title =
                        job.title
                            ?.toLowerCase() ??
                        "";

                    const location =
                        job.location
                            ?.toLowerCase() ??
                        "";

                    const organizationName =
                        job.organizationName
                            ?.toLowerCase() ??
                        job.organization
                            ?.name
                            ?.toLowerCase() ??
                        "";

                    const matchesSearch =
                        !normalizedSearch ||
                        title.includes(
                            normalizedSearch
                        ) ||
                        location.includes(
                            normalizedSearch
                        ) ||
                        organizationName.includes(
                            normalizedSearch
                        );

                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        job.status ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            jobs,
            search,
            statusFilter,
        ]);

    const statistics =
        useMemo(() => {
            const activeJobs =
                jobs.filter(
                    (job) =>
                        (job.status ??
                            "Active") ===
                        "Active"
                ).length;

            const closedJobs =
                jobs.filter(
                    (job) =>
                        job.status ===
                        "Closed"
                ).length;

            const draftJobs =
                jobs.filter(
                    (job) =>
                        job.status ===
                        "Draft"
                ).length;

            const totalApplications =
                jobs.reduce(
                    (
                        total,
                        job
                    ) =>
                        total +
                        Number(
                            job.applicationCount ??
                            0
                        ),
                    0
                );

            return {
                activeJobs,
                closedJobs,
                draftJobs,
                totalApplications,
            };
        }, [jobs]);

    if (loading) {
        return (
            <section className="manage-jobs-page">
                <div className="jobs-loading-card">
                    <div className="jobs-loader" />

                    <h2>
                        Loading jobs
                    </h2>

                    <p>
                        Please wait while we
                        prepare your vacancies.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="manage-jobs-page">

            <div className="jobs-page-header">
                <div>
                    <p className="jobs-eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>
                        Manage Jobs
                    </h1>

                    <p>
                        View, edit and manage
                        all your job postings
                        from one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="jobs-create-button"
                    onClick={() =>
                        navigate(
                            "/recruiter/create-job"
                        )
                    }
                >
                    <span>
                        Create Job
                    </span>
                </button>
            </div>

            <div className="jobs-statistics">

                <article className="jobs-stat-card">
                    <span className="jobs-stat-label">
                        Active Jobs
                    </span>

                    <strong>
                        {
                            statistics
                                .activeJobs
                        }
                    </strong>
                </article>

                <article className="jobs-stat-card">
                    <span className="jobs-stat-label">
                        Closed Jobs
                    </span>

                    <strong>
                        {
                            statistics
                                .closedJobs
                        }
                    </strong>
                </article>

                <article className="jobs-stat-card">
                    <span className="jobs-stat-label">
                        Draft Jobs
                    </span>

                    <strong>
                        {
                            statistics
                                .draftJobs
                        }
                    </strong>
                </article>

                <article className="jobs-stat-card">
                    <span className="jobs-stat-label">
                        Applications
                    </span>

                    <strong>
                        {
                            statistics
                                .totalApplications
                        }
                    </strong>
                </article>

            </div>

            {errorMessage && (
                <div
                    className="jobs-alert jobs-alert--error"
                    role="alert"
                >
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div
                    className="jobs-alert jobs-alert--success"
                    role="status"
                >
                    {successMessage}
                </div>
            )}

            <div className="jobs-content-card">
                <div className="jobs-card-accent" />

                <div className="jobs-content-header">
                    <div>
                        <p className="jobs-eyebrow">
                            Vacancy records
                        </p>

                        <h2>
                            Job Postings
                        </h2>

                        <p>
                            Search, filter and
                            update your vacancies.
                        </p>
                    </div>

                    <span className="jobs-result-count">
                        {filteredJobs.length}{" "}
                        result
                        {filteredJobs.length === 1
                            ? ""
                            : "s"}
                    </span>
                </div>

                <div className="jobs-toolbar">

                    <div className="jobs-search-field">
                        <label htmlFor="job-search">
                            Search jobs
                        </label>

                        <input
                            id="job-search"
                            type="search"
                            placeholder="Search by title, location or organization..."
                            value={search}
                            onChange={(
                                event
                            ) => {
                                setSearch(
                                    event
                                        .target
                                        .value
                                );

                                clearMessages();
                            }}
                        />
                    </div>

                    <div className="jobs-filter-field">
                        <label htmlFor="status-filter">
                            Status
                        </label>

                        <select
                            id="status-filter"
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) => {
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                );

                                clearMessages();
                            }}
                        >
                            <option value="All">
                                All Statuses
                            </option>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Closed">
                                Closed
                            </option>

                            <option value="Draft">
                                Draft
                            </option>
                        </select>
                    </div>

                </div>

                <div className="jobs-table-wrapper">
                    <table className="jobs-table">

                        <thead>
                            <tr>
                                <th>
                                    Job
                                </th>

                                <th>
                                    Location
                                </th>

                                <th>
                                    Employment
                                </th>

                                <th>
                                    Salary
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Applications
                                </th>

                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredJobs.length ===
                            0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="jobs-empty-cell"
                                    >
                                        <div className="jobs-empty-state">
                                            <h3>
                                                {jobs.length ===
                                                0
                                                    ? "No jobs created yet"
                                                    : "No matching jobs"}
                                            </h3>

                                            <p>
                                                {jobs.length ===
                                                0
                                                    ? "Create your first vacancy to start receiving applications."
                                                    : "Try changing your search text or status filter."}
                                            </p>

                                            {jobs.length ===
                                                0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/recruiter/create-job"
                                                        )
                                                    }
                                                >
                                                    Create Job
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map(
                                    (job) => {
                                        const isProcessing =
                                            processingJobId ===
                                            job.id;

                                        const status =
                                            job.status ??
                                            "Active";

                                        const initial =
                                            job.title
                                                ?.trim()
                                                .charAt(
                                                    0
                                                )
                                                .toUpperCase() ??
                                            "J";

                                        return (
                                            <tr
                                                key={
                                                    job.id
                                                }
                                            >
                                                <td>
                                                    <div className="jobs-title-cell">
                                                        <span className="jobs-title-avatar">
                                                            {
                                                                initial
                                                            }
                                                        </span>

                                                        <div>
                                                            <strong>
                                                                {job.title ??
                                                                    "Untitled Job"}
                                                            </strong>

                                                            <span>
                                                                {job.organizationName ??
                                                                    job.organization
                                                                        ?.name ??
                                                                    "Organization not specified"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {job.location ??
                                                        "Not specified"}
                                                </td>

                                                <td>
                                                    {formatEmploymentType(
                                                        job.employmentType
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="jobs-salary">
                                                        <span>
                                                            LKR
                                                        </span>

                                                        <strong>
                                                            {formatSalary(
                                                                job.salaryMin
                                                            )}
                                                            {" – "}
                                                            {formatSalary(
                                                                job.salaryMax
                                                            )}
                                                        </strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            status
                                                        )}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="jobs-application-count">
                                                        {job.applicationCount ??
                                                            0}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="jobs-actions">

                                                        <button
                                                            type="button"
                                                            className="jobs-action-button jobs-action-button--view"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/jobs/${job.id}`
                                                                )
                                                            }
                                                            disabled={
                                                                isProcessing
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="jobs-action-button jobs-action-button--edit"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/recruiter/edit-job/${job.id}`
                                                                )
                                                            }
                                                            disabled={
                                                                isProcessing
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="jobs-action-button jobs-action-button--status"
                                                            onClick={() =>
                                                                handleChangeStatus(
                                                                    job
                                                                )
                                                            }
                                                            disabled={
                                                                isProcessing ||
                                                                status ===
                                                                    "Draft"
                                                            }
                                                        >
                                                            {isProcessing
                                                                ? "Working..."
                                                                : status ===
                                                                    "Active"
                                                                    ? "Close"
                                                                    : "Open"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="jobs-action-button jobs-action-button--delete"
                                                            onClick={() =>
                                                                handleDeleteJob(
                                                                    job.id
                                                                )
                                                            }
                                                            disabled={
                                                                isProcessing
                                                            }
                                                        >
                                                            {isProcessing
                                                                ? "Working..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

        </section>
    );
}
