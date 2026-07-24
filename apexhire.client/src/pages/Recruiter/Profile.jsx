import {
    useEffect,
    useState,
} from "react";

import recruiterProfileService
    from "../../services/recruiterProfileService";

import lookupService
    from "../../services/lookupService";

import "./Profile.css";

export default function Profile() {
    const [profile, setProfile] =
        useState(null);

    const [organizations, setOrganizations] =
        useState([]);

    const [departments, setDepartments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] =
        useState({
            organizationId: "",
            departmentId: "",
            jobTitle: "",
            phoneNumber: "",
        });

    useEffect(() => {
        let isMounted = true;

        async function initializePage() {
            try {
                const organizationsData =
                    await lookupService
                        .getOrganizations();

                const profileData =
                    await recruiterProfileService
                        .getProfile();

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

                setProfile(profileData);

                setForm({
                    organizationId:
                        profileData
                            ?.organizationId ?? "",

                    departmentId:
                        profileData
                            ?.departmentId ?? "",

                    jobTitle:
                        profileData
                            ?.jobTitle ?? "",

                    phoneNumber:
                        profileData
                            ?.phoneNumber ?? "",
                });

                if (
                    profileData
                        ?.organizationId
                ) {
                    const departmentsData =
                        await lookupService
                            .getDepartments(
                                profileData
                                    .organizationId
                            );

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
                    "Unable to load recruiter profile:",
                    error
                );

                if (isMounted) {
                    alert(
                        "Unable to load recruiter profile."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        initializePage();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleOrganizationChange(
        event
    ) {
        const value =
            event.target.value;

        const organizationId =
            value === ""
                ? ""
                : Number(value);

        setForm(
            (currentForm) => ({
                ...currentForm,
                organizationId,
                departmentId: "",
            })
        );

        if (!organizationId) {
            setDepartments([]);
            return;
        }

        try {
            const departmentsData =
                await lookupService
                    .getDepartments(
                        organizationId
                    );

            setDepartments(
                Array.isArray(
                    departmentsData
                )
                    ? departmentsData
                    : []
            );
        } catch (error) {
            console.error(
                "Unable to load departments:",
                error
            );

            setDepartments([]);

            alert(
                "Unable to load departments."
            );
        }
    }

    function handleInputChange(event) {
        const {
            name,
            value,
        } = event.target;

        setForm(
            (currentForm) => ({
                ...currentForm,

                [name]:
                    name ===
                        "departmentId" &&
                    value !== ""
                        ? Number(value)
                        : value,
            })
        );
    }

    async function save() {
        if (!form.organizationId) {
            alert(
                "Please select an organization."
            );
            return;
        }

        if (!form.departmentId) {
            alert(
                "Please select a department."
            );
            return;
        }

        setSaving(true);

        try {
            const request = {
                organizationId:
                    Number(
                        form.organizationId
                    ),

                departmentId:
                    Number(
                        form.departmentId
                    ),

                jobTitle:
                    form.jobTitle.trim(),

                phoneNumber:
                    form.phoneNumber.trim(),
            };

            const updated =
                await recruiterProfileService
                    .updateProfile(
                        request
                    );

            setProfile(updated);

            setForm({
                organizationId:
                    updated
                        ?.organizationId ??
                    request.organizationId,

                departmentId:
                    updated
                        ?.departmentId ??
                    request.departmentId,

                jobTitle:
                    updated?.jobTitle ??
                    request.jobTitle,

                phoneNumber:
                    updated?.phoneNumber ??
                    request.phoneNumber,
            });

            alert(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Unable to update recruiter profile:",
                error
            );

            alert(
                error?.response
                    ?.data?.message ??
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    }

    const initial =
        profile?.fullName
            ?.trim()
            .charAt(0)
            .toUpperCase() || "R";

    if (loading) {
        return (
            <div className="recruiter-profile-page">
                <div className="profile-status-card">
                    <div className="profile-loader" />

                    <h2>
                        Loading profile
                    </h2>

                    <p>
                        Please wait while we
                        prepare your information.
                    </p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="recruiter-profile-page">
                <div className="profile-status-card">
                    <h2>
                        Recruiter profile not found
                    </h2>

                    <p>
                        The profile information
                        could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="recruiter-profile-page">
            <div className="profile-page-heading">
                <div>
                    <p className="profile-eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Review and update your
                        professional information.
                    </p>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-card-accent" />

                <header className="profile-header">
                    <div className="profile-avatar">
                        {initial}
                    </div>

                    <div className="profile-identity">
                        <span className="profile-label">
                            Recruiter account
                        </span>

                        <h2>
                            {profile.fullName ??
                                "Recruiter"}
                        </h2>

                        <p>
                            {profile.email ?? ""}
                        </p>
                    </div>
                </header>

                <div className="profile-divider" />

                <div className="profile-form-section">
                    <div className="profile-section-heading">
                        <div>
                            <p className="profile-eyebrow">
                                Professional details
                            </p>

                            <h3>
                                Employment Information
                            </h3>
                        </div>

                        <span className="profile-required-note">
                            Fields marked required
                        </span>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-field">
                            <label htmlFor="organizationId">
                                Organization
                                <span aria-hidden="true">
                                    *
                                </span>
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
                                disabled={saving}
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

                        <div className="profile-field">
                            <label htmlFor="departmentId">
                                Department
                                <span aria-hidden="true">
                                    *
                                </span>
                            </label>

                            <select
                                id="departmentId"
                                name="departmentId"
                                value={
                                    form.departmentId
                                }
                                onChange={
                                    handleInputChange
                                }
                                disabled={
                                    saving ||
                                    !form.organizationId
                                }
                            >
                                <option value="">
                                    Select department
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

                        <div className="profile-field">
                            <label htmlFor="jobTitle">
                                Job Title
                            </label>

                            <input
                                id="jobTitle"
                                name="jobTitle"
                                type="text"
                                value={
                                    form.jobTitle
                                }
                                onChange={
                                    handleInputChange
                                }
                                disabled={saving}
                                maxLength={150}
                                placeholder="Enter your job title"
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="phoneNumber">
                                Phone Number
                            </label>

                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={
                                    form.phoneNumber
                                }
                                onChange={
                                    handleInputChange
                                }
                                disabled={saving}
                                maxLength={30}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button
                            type="button"
                            className="profile-save-button"
                            onClick={save}
                            disabled={saving}
                        >
                            <span>
                                {saving
                                    ? "Saving changes..."
                                    : "Save Changes"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
