import {
    useEffect,
    useState
} from "react";

import candidateProfileService
    from "../../../services/candidateProfileService";

import getErrorMessage
    from "../../../utils/getErrorMessage";

const initialForm = {
    fullName: "",
    headline: "",
    phoneNumber: "",
    location: "",
    professionalSummary: "",
    skills: "",
    yearsOfExperience: 0,
    linkedInUrl: "",
    gitHubUrl: "",
    portfolioUrl: ""
};

export default function EditProfileModal({
    open,
    profile,
    reload,
    onClose
}) {
    const [form, setForm] =
        useState(initialForm);

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        if (!open || !profile) {
            return;
        }

        setForm({
            fullName:
                profile.fullName ?? "",

            headline:
                profile.headline ?? "",

            phoneNumber:
                profile.phoneNumber ?? "",

            location:
                profile.location ?? "",

            professionalSummary:
                profile.professionalSummary
                ?? "",

            skills:
                profile.skills ?? "",

            yearsOfExperience:
                profile.yearsOfExperience
                ?? 0,

            linkedInUrl:
                profile.linkedInUrl ?? "",

            gitHubUrl:
                profile.gitHubUrl ?? "",

            portfolioUrl:
                profile.portfolioUrl ?? ""
        });
    }, [open, profile]);

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setForm(previousForm => ({
            ...previousForm,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            form.fullName.trim().length < 3
        ) {
            alert(
                "Full name must contain at least 3 characters."
            );

            return;
        }

        const payload = {
            fullName:
                form.fullName.trim(),

            headline:
                form.headline.trim()
                || null,

            phoneNumber:
                form.phoneNumber.trim()
                || null,

            location:
                form.location.trim()
                || null,

            professionalSummary:
                form.professionalSummary
                    .trim()
                || null,

            skills:
                form.skills.trim(),

            yearsOfExperience:
                Number(
                    form.yearsOfExperience
                    || 0
                ),

            linkedInUrl:
                form.linkedInUrl.trim()
                || null,

            gitHubUrl:
                form.gitHubUrl.trim()
                || null,

            portfolioUrl:
                form.portfolioUrl.trim()
                || null
        };

        try {
            setSaving(true);

            await candidateProfileService
                .updateProfile(payload);

            await reload();

            onClose();
        }
        catch (error) {
            console.error(
                "Profile update failed:",
                error.response?.status,
                error.response?.data,
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Failed to update profile."
                )
            );
        }
        finally {
            setSaving(false);
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={event => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="modal">
                <div className="modal-header">
                    <h2>Edit Profile</h2>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                >
                    <label>
                        Full Name

                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            minLength={3}
                            maxLength={100}
                        />
                    </label>

                    <label>
                        Professional Headline

                        <input
                            type="text"
                            name="headline"
                            value={form.headline}
                            onChange={handleChange}
                            maxLength={120}
                        />
                    </label>

                    <label>
                        Phone Number

                        <input
                            type="tel"
                            name="phoneNumber"
                            value={
                                form.phoneNumber
                            }
                            onChange={handleChange}
                            maxLength={20}
                        />
                    </label>

                    <label>
                        Location

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            maxLength={150}
                        />
                    </label>

                    <label>
                        Professional Summary

                        <textarea
                            name="professionalSummary"
                            rows={6}
                            value={
                                form
                                    .professionalSummary
                            }
                            onChange={handleChange}
                            maxLength={3000}
                        />
                    </label>

                    <label>
                        Skills

                        <input
                            type="text"
                            name="skills"
                            placeholder="C#, React, SQL"
                            value={form.skills}
                            onChange={handleChange}
                            maxLength={2000}
                        />
                    </label>

                    <label>
                        Years of Experience

                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={
                                form
                                    .yearsOfExperience
                            }
                            onChange={handleChange}
                            min={0}
                            max={60}
                        />
                    </label>

                    <label>
                        LinkedIn URL

                        <input
                            type="url"
                            name="linkedInUrl"
                            value={
                                form.linkedInUrl
                            }
                            onChange={handleChange}
                            maxLength={500}
                        />
                    </label>

                    <label>
                        GitHub URL

                        <input
                            type="url"
                            name="gitHubUrl"
                            value={
                                form.gitHubUrl
                            }
                            onChange={handleChange}
                            maxLength={500}
                        />
                    </label>

                    <label>
                        Portfolio URL

                        <input
                            type="url"
                            name="portfolioUrl"
                            value={
                                form.portfolioUrl
                            }
                            onChange={handleChange}
                            maxLength={500}
                        />
                    </label>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}