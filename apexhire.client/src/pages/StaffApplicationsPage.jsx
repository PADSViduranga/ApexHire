import { useEffect, useState } from 'react';

import { apiRequest } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const recruiterStatuses = [
    { value: 2, label: 'Under Review' },
    { value: 3, label: 'Shortlisted' },
    { value: 6, label: 'Rejected' }
];

const managerStatuses = [
    { value: 4, label: 'Interview Scheduled' },
    { value: 5, label: 'Offered' },
    { value: 6, label: 'Rejected' },
    { value: 7, label: 'Hired' }
];

export default function StaffApplicationsPage() {
    const { user } = useAuth();

    const [applications, setApplications] =
        useState([]);
    const [selectedStatuses, setSelectedStatuses] =
        useState({});
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] =
        useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const statusOptions =
        user.role === 'Recruiter'
            ? recruiterStatuses
            : managerStatuses;

    async function loadApplications() {
        setLoading(true);
        setError('');

        try {
            const result = await apiRequest(
                '/api/job-applications/department'
            );

            setApplications(result.data ?? []);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadApplications();
    }, []);

    function handleStatusSelection(
        applicationId,
        value
    ) {
        setSelectedStatuses(current => ({
            ...current,
            [applicationId]: value
        }));
    }

    async function updateStatus(applicationId) {
        const selectedStatus =
            selectedStatuses[applicationId];

        if (!selectedStatus) {
            setError(
                'Select a new application status first.'
            );
            return;
        }

        setUpdatingId(applicationId);
        setError('');
        setSuccess('');

        try {
            const result = await apiRequest(
                `/api/job-applications/${applicationId}/status`,
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
                [applicationId]: ''
            }));

            await loadApplications();
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
                        {user.role} workspace
                    </p>

                    <h1>Department applications</h1>

                    <p className="muted">
                        Review candidates and move
                        applications through the hiring
                        process.
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

            {loading ? (
                <p className="status-message">
                    Loading applications...
                </p>
            ) : applications.length === 0 ? (
                <div className="empty-state">
                    <h2>No applications found</h2>

                    <p>
                        There are currently no applications
                        for jobs in your department.
                    </p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Job</th>
                                <th>Applied</th>
                                <th>Current status</th>
                                <th>New status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.map(
                                application => (
                                    <tr key={application.id}>
                                        <td>
                                            <strong>
                                                {
                                                    application.candidateName
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {application.jobTitle}
                                        </td>

                                        <td>
                                            {new Date(
                                                application.appliedAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <span className="badge">
                                                {application.status}
                                            </span>
                                        </td>

                                        <td>
                                            <select
                                                value={
                                                    selectedStatuses[
                                                    application.id
                                                    ] ?? ''
                                                }
                                                onChange={event =>
                                                    handleStatusSelection(
                                                        application.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select status
                                                </option>

                                                {statusOptions.map(
                                                    option => (
                                                        <option
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
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
                                                    application.id
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        application.id
                                                    )
                                                }
                                            >
                                                {updatingId ===
                                                    application.id
                                                    ? 'Updating...'
                                                    : 'Update'}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}