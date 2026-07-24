import { useEffect, useState } from 'react';

import { apiRequest } from '../api/apiClient';

const emptyProfile = {
    fullName: '',
    phoneNumber: '',
    location: '',
    professionalSummary: '',
    skills: '',
    yearsOfExperience: 0,
    resumeUrl: '',
    linkedInUrl: '',
    portfolioUrl: ''
};

export default function CandidateProfilePage() {
    const [form, setForm] = useState(emptyProfile);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let cancelled = false;

        apiRequest('/api/candidate-profile')
            .then(result => {
                if (!cancelled && result.data) {
                    const profile = result.data;

                    setEmail(profile.email ?? '');

                    setForm({
                        fullName: profile.fullName ?? '',
                        phoneNumber:
                            profile.phoneNumber ?? '',
                        location: profile.location ?? '',
                        professionalSummary:
                            profile.professionalSummary ??
                            '',
                        skills: profile.skills ?? '',
                        yearsOfExperience:
                            profile.yearsOfExperience ?? 0,
                        resumeUrl:
                            profile.resumeUrl ?? '',
                        linkedInUrl:
                            profile.linkedInUrl ?? '',
                        portfolioUrl:
                            profile.portfolioUrl ?? ''
                    });
                }
            })
            .catch(requestError => {
                if (!cancelled) {
                    setError(requestError.message);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const request = {
                ...form,
                yearsOfExperience: Number(
                    form.yearsOfExperience
                ),
                resumeUrl: form.resumeUrl || null,
                linkedInUrl: form.linkedInUrl || null,
                portfolioUrl:
                    form.portfolioUrl || null
            };

            const result = await apiRequest(
                '/api/candidate-profile',
                {
                    method: 'PUT',
                    body: JSON.stringify(request)
                }
            );

            setSuccess(result.message);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <p className="status-message">
                Loading profile...
            </p>
        );
    }

    return (
        <section className="form-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Candidate workspace
                    </p>

                    <h1>My profile</h1>

                    <p className="muted">
                        Keep your information and skills
                        updated for recruiters.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <form
                className="content-form"
                onSubmit={handleSubmit}
            >
                <label>
                    Full name
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        value={email}
                        disabled
                    />
                </label>

                <label>
                    Phone number
                    <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Location
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                    />
                </label>

                <label className="field-wide">
                    Professional summary
                    <textarea
                        name="professionalSummary"
                        rows="5"
                        value={
                            form.professionalSummary
                        }
                        onChange={handleChange}
                    />
                </label>

                <label className="field-wide">
                    Skills
                    <textarea
                        name="skills"
                        rows="4"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="C#, ASP.NET Core, SQL Server, React"
                    />
                </label>

                <label>
                    Years of experience
                    <input
                        type="number"
                        name="yearsOfExperience"
                        min="0"
                        max="60"
                        value={form.yearsOfExperience}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Resume URL
                    <input
                        type="url"
                        name="resumeUrl"
                        value={form.resumeUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/resume.pdf"
                    />
                </label>

                <label>
                    LinkedIn URL
                    <input
                        type="url"
                        name="linkedInUrl"
                        value={form.linkedInUrl}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Portfolio URL
                    <input
                        type="url"
                        name="portfolioUrl"
                        value={form.portfolioUrl}
                        onChange={handleChange}
                    />
                </label>

                <div className="field-wide">
                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving profile...'
                            : 'Save profile'}
                    </button>
                </div>
            </form>
        </section>
    );
}