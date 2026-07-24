import { useEffect, useState } from 'react';
import {
    Link,
    useParams
} from 'react-router-dom';

import { apiRequest } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function JobDetailsPage() {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();

    const [job, setJob] = useState(null);
    const [coverLetter, setCoverLetter] =
        useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] =
        useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function loadJob() {
            setLoading(true);
            setError('');

            try {
                const result = await apiRequest(
                    `/api/jobs/${id}`
                );

                setJob(result.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadJob();
    }, [id]);

    async function handleApply(event) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const result = await apiRequest(
                '/api/job-applications',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        jobPostId: Number(id),
                        coverLetter
                    })
                }
            );

            setSuccess(result.message);
            setCoverLetter('');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <p className="status-message">
                Loading job details...
            </p>
        );
    }

    if (!job) {
        return (
            <div className="empty-state">
                <h1>Job unavailable</h1>
                <p>
                    {error ||
                        'This job could not be found.'}
                </p>

                <Link
                    className="button button-primary"
                    to="/jobs"
                >
                    Back to jobs
                </Link>
            </div>
        );
    }

    return (
        <section className="details-layout">
            <article className="details-card">
                <Link
                    className="back-link"
                    to="/jobs"
                >
                    ← Back to jobs
                </Link>

                <div className="card-row">
                    <span className="badge">
                        {job.employmentType}
                    </span>

                    <span className="muted">
                        {job.status}
                    </span>
                </div>

                <h1>{job.title}</h1>

                <p className="company-name">
                    {job.organizationName}
                </p>

                <div className="job-facts">
                    <span>{job.location}</span>

                    {job.departmentName && (
                        <span>
                            {job.departmentName}
                        </span>
                    )}

                    <span>
                        {job.salaryMin.toLocaleString()}
                        {' – '}
                        {job.salaryMax.toLocaleString()}
                    </span>
                </div>

                <h2>Job description</h2>
                <p className="pre-line">
                    {job.description}
                </p>

                <h2>Required skills</h2>
                <p>
                    {job.requiredSkills ||
                        'No specific skills listed.'}
                </p>

                {job.applicationDeadline && (
                    <>
                        <h2>Application deadline</h2>
                        <p>
                            {new Date(
                                job.applicationDeadline
                            ).toLocaleDateString()}
                        </p>
                    </>
                )}
            </article>

            <aside className="application-card">
                <h2>Apply for this job</h2>

                {!isAuthenticated ? (
                    <>
                        <p>
                            Log in with a candidate account
                            to submit an application.
                        </p>

                        <Link
                            className="button button-primary button-full"
                            to="/login"
                        >
                            Log in to apply
                        </Link>
                    </>
                ) : user.role !== 'Candidate' ? (
                    <p className="alert alert-info">
                        Only candidate accounts can apply
                        for jobs.
                    </p>
                ) : (
                    <form
                        className="form-stack"
                        onSubmit={handleApply}
                    >
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

                        <label>
                            Cover letter
                            <textarea
                                rows="9"
                                maxLength="3000"
                                value={coverLetter}
                                onChange={event =>
                                    setCoverLetter(
                                        event.target.value
                                    )
                                }
                                placeholder="Explain why you are interested in this position."
                            />
                        </label>

                        <button
                            className="button button-primary button-full"
                            type="submit"
                            disabled={
                                submitting ||
                                Boolean(success)
                            }
                        >
                            {submitting
                                ? 'Submitting...'
                                : success
                                    ? 'Application submitted'
                                    : 'Submit application'}
                        </button>
                    </form>
                )}
            </aside>
        </section>
    );
}