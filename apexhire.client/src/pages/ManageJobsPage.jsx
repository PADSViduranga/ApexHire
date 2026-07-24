import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { apiRequest } from '../api/apiClient';

const jobStatuses = [
    {
        value: 1,
        label: 'Draft'
    },
    {
        value: 2,
        label: 'Published'
    },
    {
        value: 3,
        label: 'Closed'
    },
    {
        value: 4,
        label: 'Archived'
    }
];

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedStatuses, setSelectedStatuses] =
        useState({});
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] =
        useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function loadJobs() {
        try {
            const result = await apiRequest(
                '/api/jobs/mine'
            );

            setJobs(result.data ?? []);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        apiRequest('/api/jobs/mine')
            .then(result => {
                if (!cancelled) {
                    setJobs(result.data ?? []);
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

    function selectStatus(jobId, value) {
        setSelectedStatuses(current => ({
            ...current,
            [jobId]: value
        }));
    }

    async function updateStatus(jobId) {
        const selectedStatus =
            selectedStatuses[jobId];

        if (!selectedStatus) {
            setError('Select a new job status.');
            return;
        }

        setUpdatingId(jobId);
        setError('');
        setSuccess('');

        try {
            const result = await apiRequest(
                `/api/jobs/${jobId}/status`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        status: Number(selectedStatus)
                    })
                }
            );

            setSuccess(result.message);

            setSelectedStatuses(current => ({
                ...current,
                [jobId]: ''
            }));

            await loadJobs();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>Manage jobs</h1>

                    <p className="muted">
                        View every job you created and
                        control its publication status.
                    </p>
                </div>

                <Link
                    className="button button-primary"
                    to="/jobs/create"
                >
                    Create new job
                </Link>
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

            {loading ? (
                <p className="status-message">
                    Loading your jobs...
                </p>
            ) : jobs.length === 0 ? (
                <div className="empty-state">
                    <h2>No jobs created yet</h2>

                    <Link
                        className="button button-primary"
                        to="/jobs/create"
                    >
                        Create your first job
                    </Link>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Job</th>
                                <th>Location</th>
                                <th>Current status</th>
                                <th>Created</th>
                                <th>New status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td>
                                        <strong>
                                            {job.title}
                                        </strong>

                                        <div className="muted">
                                            {
                                                job.departmentName
                                            }
                                        </div>
                                    </td>

                                    <td>{job.location}</td>

                                    <td>
                                        <span className="badge">
                                            {job.status}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(
                                            job.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <select
                                            value={
                                                selectedStatuses[
                                                job.id
                                                ] ?? ''
                                            }
                                            onChange={event =>
                                                selectStatus(
                                                    job.id,
                                                    event.target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select status
                                            </option>

                                            {jobStatuses.map(
                                                status => (
                                                    <option
                                                        key={
                                                            status.value
                                                        }
                                                        value={
                                                            status.value
                                                        }
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="button button-primary button-small"
                                            disabled={
                                                updatingId ===
                                                job.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    job.id
                                                )
                                            }
                                        >
                                            {updatingId ===
                                                job.id
                                                ? 'Updating...'
                                                : 'Update'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}