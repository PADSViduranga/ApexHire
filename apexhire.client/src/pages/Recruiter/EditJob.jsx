import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import jobService
    from "../../services/jobService";

import lookupService
    from "../../services/lookupService";

import "./EditJob.css";

const initialForm = {
    title: "",
    description: "",
    location: "",
    employmentType: "",
    salaryMin: "",
    salaryMax: "",
    closingDate: "",
    organizationId: "",
    departmentId: "",
};

function getErrorMessage(
    error,
    fallbackMessage
) {
    const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.response?.data ||
        fallbackMessage;

    return typeof apiMessage === "string"
        ? apiMessage
        : fallbackMessage;
}

export default function EditJob() {
    const { jobId } = useParams();

    const navigate = useNavigate();

    const [
        form,
        setForm,
    ] = useState(initialForm);

    const [
        organizations,
        setOrganizations,
    ] = useState([]);

    const [
        departments,
        setDepartments,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        loadingDepartments,
        setLoadingDepartments,
    ] = useState(false);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

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

        async function loadEditPage() {
            setLoading(true);
            setErrorMessage("");

            try {
                const [
                    organizationsResponse,
                    jobResponse,
                ] = await Promise.all([
                    lookupService
                        .getOrganizations(),

                    jobService
                        .getJobById(jobId),
                ]);

                const organizationsData =
                    organizationsResponse?.data ??
                    organizationsResponse;

                const jobData =
                    jobResponse?.data ??
                    jobResponse;

                if (!isMounted) {
                    return;
                }

                setOrganizations(
                    Array.isArray(
                        organizationsData
                    )
                        ? organizationsData
                        : []
                );

                const organizationId =
                    jobData?.organizationId ??
                    jobData?.organization?.id ??
                    "";

                const departmentId =
                    jobData?.departmentId ??
                    jobData?.department?.id ??
                    "";

                setForm({
                    title:
                        jobData?.title ?? "",

                    description:
                        jobData?.description ?? "",

                    location:
                        jobData?.location ?? "",

                    employmentType:
                        jobData?.employmentType ?? "",

                    salaryMin:
                        jobData?.salaryMin ?? "",

                    salaryMax:
                        jobData?.salaryMax ?? "",

                    closingDate:
                        jobData?.closingDate
                            ? jobData.closingDate
                                .substring(0, 10)
                            : "",

                    organizationId:
                        organizationId
                            ? String(
                                organizationId
                            )
                            : "",

                    departmentId:
                        departmentId
                            ? String(
                                departmentId
                            )
                            : "",
                });

                if (organizationId) {
                    const departmentsResponse =
                        await lookupService
                            .getDepartments(
                                organizationId
                            );

                    const departmentsData =
                        departmentsResponse?.data ??
                        departmentsResponse;

                    if (isMounted) {
                        setDepartments(
                            Array.isArray(
                                departmentsData
                            )
                                ? departmentsData
                                : []
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load job:",
                    error
                );

                if (isMounted) {
                    setErrorMessage(
                        getErrorMessage(
                            error,
                            "Unable to load the job."
                        )
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadEditPage();

        return () => {
            isMounted = false;
        };
    }, [jobId]);

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setForm(
            (currentForm) => ({
                ...currentForm,
                [name]: value,
            })
        );

        clearMessages();
    }

    async function handleOrganizationChange(
        event
    ) {
        const organizationId =
            event.target.value;

        setForm(
            (currentForm) => ({
                ...currentForm,
                organizationId,
                departmentId: "",
            })
        );

        setDepartments([]);
        clearMessages();

        if (!organizationId) {
            return;
        }

        setLoadingDepartments(true);

        try {
            const response =
                await lookupService
                    .getDepartments(
                        organizationId
                    );

            const data =
                response?.data ??
                response;

            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load departments:",
                error
            );

            setDepartments([]);

            setErrorMessage(
                "Unable to load departments."
            );
        } finally {
            setLoadingDepartments(false);
        }
    }

    function validateForm() {
        if (!form.title.trim()) {
            return "Job title is required.";
        }

        if (!form.location.trim()) {
            return "Job location is required.";
        }

        if (!form.employmentType) {
            return "Employment type is required.";
        }

        if (!form.organizationId) {
            return "Organization is required.";
        }

        if (!form.departmentId) {
            return "Department is required.";
        }

        if (!form.closingDate) {
            return "Closing date is required.";
        }

        if (!form.description.trim()) {
            return "Job description is required.";
        }

        const salaryMin =
            Number(form.salaryMin);

        const salaryMax =
            Number(form.salaryMax);

        if (
            form.salaryMin === "" ||
            Number.isNaN(salaryMin) ||
            salaryMin < 0
        ) {
            return (
                "Enter a valid minimum salary."
            );
        }

        if (
            form.salaryMax === "" ||
            Number.isNaN(salaryMax) ||
            salaryMax < 0
        ) {
            return (
                "Enter a valid maximum salary."
            );
        }

        if (salaryMin > salaryMax) {
            return (
                "Minimum salary cannot be greater than maximum salary."
            );
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationError =
            validateForm();

        if (validationError) {
            setErrorMessage(
                validationError
            );

            setSuccessMessage("");
            return;
        }

        setSubmitting(true);
        clearMessages();

        const payload = {
            title:
                form.title.trim(),

            description:
                form.description.trim(),

            location:
                form.location.trim(),

            employmentType:
                form.employmentType,

            salaryMin:
                Number(form.salaryMin),

            salaryMax:
                Number(form.salaryMax),

            closingDate:
                form.closingDate,

            organizationId:
                Number(
                    form.organizationId
                ),

            departmentId:
                Number(
                    form.departmentId
                ),
        };

        try {
            await jobService.updateJob(
                jobId,
                payload
            );

            setSuccessMessage(
                "Job updated successfully."
            );

            window.setTimeout(() => {
                navigate(
                    "/recruiter/jobs"
                );
            }, 700);
        } catch (error) {
            console.error(
                "Failed to update job:",
                error
            );

            setErrorMessage(
                getErrorMessage(
                    error,
                    "Unable to update the job."
                )
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <section className="edit-job-page">
                <div className="edit-job-loading">
                    <div className="edit-job-loader" />

                    <h2>
                        Loading job details
                    </h2>

                    <p>
                        Preparing the vacancy
                        information for editing.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="edit-job-page">
            <div className="edit-job-page-header">
                <div>
                    <p className="edit-job-eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>
                        Edit Job
                    </h1>

                    <p>
                        Update vacancy details,
                        salary information and
                        application settings.
                    </p>
                </div>

                <button
                    type="button"
                    className="edit-job-back-button"
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs"
                        )
                    }
                    disabled={submitting}
                >
                    Back to Jobs
                </button>
            </div>

            {errorMessage && (
                <div
                    className="edit-job-alert edit-job-alert--error"
                    role="alert"
                >
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div
                    className="edit-job-alert edit-job-alert--success"
                    role="status"
                >
                    {successMessage}
                </div>
            )}

            <div className="edit-job-card">
                <div className="edit-job-card-accent" />

                <div className="edit-job-card-header">
                    <div>
                        <p className="edit-job-eyebrow">
                            Vacancy information
                        </p>

                        <h2>
                            Job Details
                        </h2>

                        <p>
                            Fields marked as required
                            must be completed before
                            saving.
                        </p>
                    </div>

                    <span className="edit-job-badge">
                        Job #{jobId}
                    </span>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="edit-job-section">
                        <div className="edit-job-section-title">
                            <span>
                                01
                            </span>

                            <div>
                                <h3>
                                    Basic Information
                                </h3>

                                <p>
                                    Main vacancy title,
                                    location and employment
                                    type.
                                </p>
                            </div>
                        </div>

                        <div className="edit-job-grid">
                            <div className="edit-job-field">
                                <label htmlFor="title">
                                    Job Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Software Engineer"
                                    disabled={
                                        submitting
                                    }
                                    required
                                />
                            </div>

                            <div className="edit-job-field">
                                <label htmlFor="location">
                                    Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={
                                        form.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Colombo"
                                    disabled={
                                        submitting
                                    }
                                    required
                                />
                            </div>

                            <div className="edit-job-field">
                                <label htmlFor="employmentType">
                                    Employment Type
                                </label>

                                <select
                                    id="employmentType"
                                    name="employmentType"
                                    value={
                                        form.employmentType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    required
                                >
                                    <option value="">
                                        Select employment type
                                    </option>

                                    <option value="FullTime">
                                        Full Time
                                    </option>

                                    <option value="PartTime">
                                        Part Time
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>
                                </select>
                            </div>

                            <div className="edit-job-field">
                                <label htmlFor="closingDate">
                                    Closing Date
                                </label>

                                <input
                                    id="closingDate"
                                    name="closingDate"
                                    type="date"
                                    value={
                                        form.closingDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="edit-job-divider" />

                    <div className="edit-job-section">
                        <div className="edit-job-section-title">
                            <span>
                                02
                            </span>

                            <div>
                                <h3>
                                    Organization Details
                                </h3>

                                <p>
                                    Assign the vacancy to
                                    the correct organization
                                    and department.
                                </p>
                            </div>
                        </div>

                        <div className="edit-job-grid">
                            <div className="edit-job-field">
                                <label htmlFor="organizationId">
                                    Organization
                                </label>

                                <select
                                    id="organizationId"
                                    name="organizationId"
                                    value={
                                        form.organizationId
                                    }
                                    onChange={
                                        handleOrganizationChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    required
                                >
                                    <option value="">
                                        Select organization
                                    </option>

                                    {organizations.map(
                                        (
                                            organization
                                        ) => (
                                            <option
                                                key={
                                                    organization.id
                                                }
                                                value={
                                                    organization.id
                                                }
                                            >
                                                {
                                                    organization.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="edit-job-field">
                                <label htmlFor="departmentId">
                                    Department
                                </label>

                                <select
                                    id="departmentId"
                                    name="departmentId"
                                    value={
                                        form.departmentId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        !form.organizationId ||
                                        loadingDepartments ||
                                        submitting
                                    }
                                    required
                                >
                                    <option value="">
                                        {loadingDepartments
                                            ? "Loading departments..."
                                            : "Select department"}
                                    </option>

                                    {departments.map(
                                        (
                                            department
                                        ) => (
                                            <option
                                                key={
                                                    department.id
                                                }
                                                value={
                                                    department.id
                                                }
                                            >
                                                {
                                                    department.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="edit-job-divider" />

                    <div className="edit-job-section">
                        <div className="edit-job-section-title">
                            <span>
                                03
                            </span>

                            <div>
                                <h3>
                                    Salary Details
                                </h3>

                                <p>
                                    Enter the expected
                                    monthly salary range.
                                </p>
                            </div>
                        </div>

                        <div className="edit-job-grid">
                            <div className="edit-job-field">
                                <label htmlFor="salaryMin">
                                    Minimum Salary
                                </label>

                                <div className="edit-job-money-field">
                                    <span>
                                        LKR
                                    </span>

                                    <input
                                        id="salaryMin"
                                        name="salaryMin"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.salaryMin
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="80000"
                                        disabled={
                                            submitting
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="edit-job-field">
                                <label htmlFor="salaryMax">
                                    Maximum Salary
                                </label>

                                <div className="edit-job-money-field">
                                    <span>
                                        LKR
                                    </span>

                                    <input
                                        id="salaryMax"
                                        name="salaryMax"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.salaryMax
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="150000"
                                        disabled={
                                            submitting
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="edit-job-divider" />

                    <div className="edit-job-section">
                        <div className="edit-job-section-title">
                            <span>
                                04
                            </span>

                            <div>
                                <h3>
                                    Job Description
                                </h3>

                                <p>
                                    Describe responsibilities,
                                    skills and qualifications.
                                </p>
                            </div>
                        </div>

                        <div className="edit-job-field edit-job-field--full">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows="9"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter responsibilities, qualifications and other job details..."
                                disabled={
                                    submitting
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="edit-job-actions">
                        <button
                            type="button"
                            className="edit-job-cancel-button"
                            onClick={() =>
                                navigate(
                                    "/recruiter/jobs"
                                )
                            }
                            disabled={
                                submitting
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-job-submit-button"
                            disabled={
                                submitting
                            }
                        >
                            {submitting
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
