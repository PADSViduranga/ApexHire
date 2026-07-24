import { useState } from 'react';
import { Link } from 'react-router-dom';

import { apiRequest } from '../api/apiClient';

const initialForm = {
    title: '',
    description: '',
    location: '',
    employmentType: '1',
    requiredSkills: '',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    publishImmediately: true
};

export default function CreateJobPage() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [createdJobId, setCreatedJobId] =
        useState(null);
    const [submitting, setSubmitting] =
        useState(false);

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm(current => ({
            ...current,
            [name]: type === 'checkbox'
                ? checked
                : value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setCreatedJobId(null);
        setSubmitting(true);

        try {
            const request = {
                title: form.title,
                description: form.description,
                location: form.location,
                employmentType: Number(
                    form.employmentType
                ),
                requiredSkills: form.requiredSkills,
                salaryMin: Number(form.salaryMin),
                salaryMax: Number(form.salaryMax),
                applicationDeadline:
                    form.applicationDeadline
                        ? new Date(
                            form.applicationDeadline
                        ).toISOString()
                        : null,
                publishImmediately:
                    form.publishImmediately
            };

            const result = await apiRequest(
                '/api/jobs',
                {
                    method: 'POST',
                    body: JSON.stringify(request)
                }
            );

            setSuccess(result.message);
            setCreatedJobId(result.data.id);
            setForm(initialForm);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="form-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>Create a job</h1>

                    <p className="muted">
                        The job will automatically use your
                        assigned organization and department.
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

                    {createdJobId && (
                        <>
                            {' '}
                            <Link
                                to={`/jobs/${createdJobId}`}
                            >
                                View job
                            </Link>
                        </>
                    )}
                </div>
            )}

            <form
                className="content-form"
                onSubmit={handleSubmit}
            >
                <label className="field-wide">
                    Job title
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength="150"
                        required
                    />
                </label>

                <label className="field-wide">
                    Description
                    <textarea
                        name="description"
                        rows="8"
                        value={form.description}
                        onChange={handleChange}
                        maxLength="5000"
                        required
                    />
                </label>

                <label>
                    Location
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        maxLength="150"
                        required
                    />
                </label>

                <label>
                    Employment type
                    <select
                        name="employmentType"
                        value={form.employmentType}
                        onChange={handleChange}
                        required
                    >
                        <option value="1">
                            Full time
                        </option>
                        <option value="2">
                            Part time
                        </option>
                        <option value="3">
                            Contract
                        </option>
                        <option value="4">
                            Internship
                        </option>
                        <option value="5">
                            Temporary
                        </option>
                    </select>
                </label>

                <label className="field-wide">
                    Required skills
                    <textarea
                        name="requiredSkills"
                        rows="4"
                        value={form.requiredSkills}
                        onChange={handleChange}
                        maxLength="1500"
                    />
                </label>

                <label>
                    Minimum salary
                    <input
                        type="number"
                        name="salaryMin"
                        min="0"
                        step="0.01"
                        value={form.salaryMin}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Maximum salary
                    <input
                        type="number"
                        name="salaryMax"
                        min="0"
                        step="0.01"
                        value={form.salaryMax}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Application deadline
                    <input
                        type="datetime-local"
                        name="applicationDeadline"
                        value={form.applicationDeadline}
                        onChange={handleChange}
                    />
                </label>

                <label className="checkbox-field">
                    <input
                        type="checkbox"
                        name="publishImmediately"
                        checked={
                            form.publishImmediately
                        }
                        onChange={handleChange}
                    />

                    Publish immediately
                </label>

                <div className="field-wide">
                    <button
                        className="button button-primary"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Creating job...'
                            : 'Create job'}
                    </button>
                </div>
            </form>
        </section>
    );
}