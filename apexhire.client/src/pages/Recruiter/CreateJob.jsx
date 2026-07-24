import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import jobService
    from "../../services/jobService";

import lookupService
    from "../../services/lookupService";

import "./CreateJob.css";

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

export default function CreateJob() {
    const navigate = useNavigate();

    const [form, setForm] =
        useState(initialForm);

    const [organizations, setOrganizations] =
        useState([]);

    const [departments, setDepartments] =
        useState([]);

    const [
        loadingOrganizations,
        setLoadingOrganizations,
    ] = useState(true);

    const [
        loadingDepartments,
        setLoadingDepartments,
    ] = useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchOrganizations() {
            setLoadingOrganizations(true);

            try {
                const response =
                    await lookupService
                        .getOrganizations();

                const data =
                    response?.data ??
                    response;

                if (isMounted) {
                    setOrganizations(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load organizations:",
                    error
                );

                if (isMounted) {
                    setOrganizations([]);

                    setErrorMessage(
                        "Unable to load organizations."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoadingOrganizations(
                        false
                    );
                }
            }
        }

        void fetchOrganizations();

        return () => {
            isMounted = false;
        };
    }, []);

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

        setErrorMessage("");
        setSuccessMessage("");
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
        setErrorMessage("");
        setSuccessMessage("");

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
            return "Enter a valid minimum salary.";
        }

        if (
            form.salaryMax === "" ||
            Number.isNaN(salaryMax) ||
            salaryMax < 0
        ) {
            return "Enter a valid maximum salary.";
        }

        if (salaryMin > salaryMax) {
            return "Minimum salary cannot be greater than maximum salary.";
        }

        const selectedDate =
            new Date(
                `${form.closingDate}T00:00:00`
            );

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return "Closing date cannot be in the past.";
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
        setErrorMessage("");
        setSuccessMessage("");

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
            await jobService
                .createJob(payload);

            setSuccessMessage(
                "Job created successfully."
            );

            setForm(initialForm);
            setDepartments([]);

            setTimeout(() => {
                navigate(
                    "/recruiter/jobs"
                );
            }, 700);
        } catch (error) {
            console.error(
                "Failed to create job:",
                error
            );

            const apiMessage =
                error?.response
                    ?.data?.message ||
                error?.response
                    ?.data?.title ||
                error?.response
                    ?.data ||
                "Unable to create the job.";

            setErrorMessage(
                typeof apiMessage ===
                    "string"
                    ? apiMessage
                    : "Unable to create the job."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="create-job-page">
            <div className="create-job-heading">
                <div>
                    <p className="create-job-eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>
                        Create Job
                    </h1>

                    <p>
                        Publish a professional
                        vacancy and start finding
                        qualified candidates.
                    </p>
                </div>

                <button
                    type="button"
                    className="create-job-back-button"
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

            <div className="create-job-card">
                <div className="create-job-accent" />

                <div className="create-job-card-header">
                    <div>
                        <p className="create-job-eyebrow">
                            Vacancy details
                        </p>

                        <h2>
                            Job Information
                        </h2>

                        <p>
                            Complete all required
                            information before
                            publishing the vacancy.
                        </p>
                    </div>

                    <span className="create-job-required-note">
                        Required fields marked *
                    </span>
                </div>

                {errorMessage && (
                    <div
                        className="create-job-alert create-job-alert--error"
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div
                        className="create-job-alert create-job-alert--success"
                        role="status"
                    >
                        {successMessage}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="create-job-grid">
                        <div className="create-job-field">
                            <label htmlFor="title">
                                Job Title
                                <span>*</span>
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
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="create-job-field">
                            <label htmlFor="location">
                                Location
                                <span>*</span>
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
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="create-job-field">
                            <label htmlFor="organizationId">
                                Organization
                                <span>*</span>
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
                                    loadingOrganizations ||
                                    submitting
                                }
                                required
                            >
                                <option value="">
                                    {loadingOrganizations
                                        ? "Loading organizations..."
                                        : "Select organization"}
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

                        <div className="create-job-field">
                            <label htmlFor="departmentId">
                                Department
                                <span>*</span>
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

                        <div className="create-job-field">
                            <label htmlFor="employmentType">
                                Employment Type
                                <span>*</span>
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
                                disabled={submitting}
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

                        <div className="create-job-field">
                            <label htmlFor="closingDate">
                                Closing Date
                                <span>*</span>
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
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="create-job-field">
                            <label htmlFor="salaryMin">
                                Minimum Salary
                                <span>*</span>
                            </label>

                            <div className="create-job-money-field">
                                <span>LKR</span>

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

                        <div className="create-job-field">
                            <label htmlFor="salaryMax">
                                Maximum Salary
                                <span>*</span>
                            </label>

                            <div className="create-job-money-field">
                                <span>LKR</span>

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

                    <div className="create-job-field create-job-description">
                        <label htmlFor="description">
                            Job Description
                            <span>*</span>
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="8"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter responsibilities, qualifications, required skills and other job details..."
                            disabled={submitting}
                            required
                        />
                    </div>

                    <div className="create-job-actions">
                        <button
                            type="button"
                            className="create-job-cancel-button"
                            onClick={() =>
                                navigate(
                                    "/recruiter/jobs"
                                )
                            }
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-job-submit-button"
                            disabled={
                                submitting ||
                                loadingOrganizations
                            }
                        >
                            <span>
                                {submitting
                                    ? "Creating Job..."
                                    : "Create Job"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
