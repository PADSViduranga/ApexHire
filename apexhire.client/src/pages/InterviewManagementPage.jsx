import { useEffect, useMemo, useState } from 'react';

import { apiRequest } from '../api/apiClient';

const initialForm = {
    jobApplicationId: '',
    scheduledAt: '',
    durationMinutes: 60,
    location: '',
    meetingUrl: '',
    instructions: ''
};

const initialRescheduleForm = {
    scheduledAt: '',
    durationMinutes: 60,
    location: '',
    meetingUrl: '',
    instructions: ''
};

function formatDateTimeLocal(dateValue) {
    if (!dateValue) {
        return '';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const timezoneOffset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 16);
}

export default function InterviewManagementPage() {
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);

    const [form, setForm] = useState(initialForm);

    const [
        editingInterview,
        setEditingInterview
    ] = useState(null);

    const [
        rescheduleForm,
        setRescheduleForm
    ] = useState(initialRescheduleForm);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] =
        useState('All');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] =
        useState(false);
    const [rescheduling, setRescheduling] =
        useState(false);
    const [updatingId, setUpdatingId] =
        useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function loadData() {
        const [
            applicationResult,
            interviewResult
        ] = await Promise.all([
            apiRequest(
                '/api/job-applications/department'
            ),
            apiRequest('/api/interviews/department')
        ]);

        setApplications(
            (applicationResult.data ?? []).filter(
                application =>
                    ![
                        'Withdrawn',
                        'Rejected',
                        'Hired'
                    ].includes(application.status)
            )
        );

        setInterviews(interviewResult.data ?? []);
    }

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');

        Promise.all([
            apiRequest(
                '/api/job-applications/department'
            ),
            apiRequest('/api/interviews/department')
        ])
            .then(
                ([
                    applicationResult,
                    interviewResult
                ]) => {
                    if (cancelled) {
                        return;
                    }

                    setApplications(
                        (
                            applicationResult.data ?? []
                        ).filter(
                            application =>
                                ![
                                    'Withdrawn',
                                    'Rejected',
                                    'Hired'
                                ].includes(
                                    application.status
                                )
                        )
                    );

                    setInterviews(
                        interviewResult.data ?? []
                    );
                }
            )
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

    const filteredInterviews = useMemo(() => {
        const normalizedSearch = searchTerm
            .trim()
            .toLowerCase();

        return interviews.filter(interview => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                interview.candidateName
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                interview.jobTitle
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                interview.location
                    ?.toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus =
                statusFilter === 'All' ||
                interview.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [interviews, searchTerm, statusFilter]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));
    }

    function handleRescheduleChange(event) {
        const { name, value } = event.target;

        setRescheduleForm(current => ({
            ...current,
            [name]: value
        }));
    }

    async function scheduleInterview(event) {
        event.preventDefault();

        if (
            !form.location.trim() &&
            !form.meetingUrl.trim()
        ) {
            setError(
                'Enter either a physical location or an online meeting URL.'
            );
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const result = await apiRequest(
                '/api/interviews',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        jobApplicationId: Number(
                            form.jobApplicationId
                        ),
                        scheduledAt: new Date(
                            form.scheduledAt
                        ).toISOString(),
                        durationMinutes: Number(
                            form.durationMinutes
                        ),
                        location:
                            form.location.trim() ||
                            null,
                        meetingUrl:
                            form.meetingUrl.trim() ||
                            null,
                        instructions:
                            form.instructions.trim() ||
                            null
                    })
                }
            );

            setSuccess(
                result.message ??
                'Interview scheduled successfully.'
            );

            setForm(initialForm);

            await loadData();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function updateStatus(
        interviewId,
        status,
        actionName
    ) {
        const confirmed = window.confirm(
            `Are you sure you want to ${actionName} this interview?`
        );

        if (!confirmed) {
            return;
        }

        setUpdatingId(interviewId);
        setError('');
        setSuccess('');

        try {
            const result = await apiRequest(
                `/api/interviews/${interviewId}/status`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        status
                    })
                }
            );

            setSuccess(
                result.message ??
                'Interview status updated successfully.'
            );

            await loadData();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setUpdatingId(null);
        }
    }

    function openRescheduleForm(interview) {
        setError('');
        setSuccess('');

        setEditingInterview(interview);

        setRescheduleForm({
            scheduledAt: formatDateTimeLocal(
                interview.scheduledAt
            ),
            durationMinutes:
                interview.durationMinutes ?? 60,
            location: interview.location ?? '',
            meetingUrl: interview.meetingUrl ?? '',
            instructions:
                interview.instructions ?? ''
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function closeRescheduleForm() {
        setEditingInterview(null);
        setRescheduleForm(initialRescheduleForm);
    }

    async function rescheduleInterview(event) {
        event.preventDefault();

        if (!editingInterview) {
            return;
        }

        if (
            !rescheduleForm.location.trim() &&
            !rescheduleForm.meetingUrl.trim()
        ) {
            setError(
                'Enter either a physical location or an online meeting URL.'
            );
            return;
        }

        setRescheduling(true);
        setError('');
        setSuccess('');

        try {
            const result = await apiRequest(
                `/api/interviews/${editingInterview.id}/reschedule`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        scheduledAt: new Date(
                            rescheduleForm.scheduledAt
                        ).toISOString(),
                        durationMinutes: Number(
                            rescheduleForm.durationMinutes
                        ),
                        location:
                            rescheduleForm.location.trim() ||
                            null,
                        meetingUrl:
                            rescheduleForm.meetingUrl.trim() ||
                            null,
                        instructions:
                            rescheduleForm.instructions.trim() ||
                            null
                    })
                }
            );

            setSuccess(
                result.message ??
                'Interview rescheduled successfully.'
            );

            closeRescheduleForm();

            await loadData();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setRescheduling(false);
        }
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Hiring manager workspace
                    </p>

                    <h1>Interview management</h1>

                    <p className="muted">
                        Schedule and manage candidate
                        interviews for your department.
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

            {editingInterview ? (
                <>
                    <div className="page-heading">
                        <div>
                            <p className="eyebrow">
                                Update interview
                            </p>

                            <h2>Reschedule interview</h2>

                            <p className="muted">
                                Rescheduling interview for{' '}
                                <strong>
                                    {
                                        editingInterview.candidateName
                                    }
                                </strong>
                                {' — '}
                                {editingInterview.jobTitle}
                            </p>
                        </div>
                    </div>

                    <form
                        className="content-form"
                        onSubmit={rescheduleInterview}
                    >
                        <label>
                            New date and time
                            <input
                                type="datetime-local"
                                name="scheduledAt"
                                value={
                                    rescheduleForm.scheduledAt
                                }
                                onChange={
                                    handleRescheduleChange
                                }
                                required
                            />
                        </label>

                        <label>
                            Duration in minutes
                            <input
                                type="number"
                                name="durationMinutes"
                                min="15"
                                max="480"
                                value={
                                    rescheduleForm.durationMinutes
                                }
                                onChange={
                                    handleRescheduleChange
                                }
                                required
                            />
                        </label>

                        <label>
                            Physical location
                            <input
                                name="location"
                                value={
                                    rescheduleForm.location
                                }
                                onChange={
                                    handleRescheduleChange
                                }
                                maxLength="150"
                                placeholder="Meeting Room 2"
                            />
                        </label>

                        <label>
                            Online meeting URL
                            <input
                                type="url"
                                name="meetingUrl"
                                value={
                                    rescheduleForm.meetingUrl
                                }
                                onChange={
                                    handleRescheduleChange
                                }
                                maxLength="500"
                                placeholder="https://meet.example.com/interview"
                            />
                        </label>

                        <label className="field-wide">
                            Candidate instructions
                            <textarea
                                name="instructions"
                                rows="4"
                                value={
                                    rescheduleForm.instructions
                                }
                                onChange={
                                    handleRescheduleChange
                                }
                                maxLength="2000"
                                placeholder="Please join five minutes early."
                            />
                        </label>

                        <div className="field-wide table-actions">
                            <button
                                className="button button-primary"
                                type="submit"
                                disabled={rescheduling}
                            >
                                {rescheduling
                                    ? 'Rescheduling...'
                                    : 'Save new schedule'}
                            </button>

                            <button
                                className="button button-outline"
                                type="button"
                                onClick={closeRescheduleForm}
                                disabled={rescheduling}
                            >
                                Cancel editing
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <h2>Schedule a new interview</h2>

                    <form
                        className="content-form"
                        onSubmit={scheduleInterview}
                    >
                        <label className="field-wide">
                            Candidate application
                            <select
                                name="jobApplicationId"
                                value={
                                    form.jobApplicationId
                                }
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select application
                                </option>

                                {applications.map(
                                    application => (
                                        <option
                                            key={
                                                application.id
                                            }
                                            value={
                                                application.id
                                            }
                                        >
                                            {
                                                application.candidateName
                                            }
                                            {' — '}
                                            {
                                                application.jobTitle
                                            }
                                            {' ('}
                                            {
                                                application.status
                                            }
                                            {')'}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label>
                            Date and time
                            <input
                                type="datetime-local"
                                name="scheduledAt"
                                value={form.scheduledAt}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Duration in minutes
                            <input
                                type="number"
                                name="durationMinutes"
                                min="15"
                                max="480"
                                value={
                                    form.durationMinutes
                                }
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Physical location
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                maxLength="150"
                                placeholder="Meeting Room 2"
                            />
                        </label>

                        <label>
                            Online meeting URL
                            <input
                                type="url"
                                name="meetingUrl"
                                value={form.meetingUrl}
                                onChange={handleChange}
                                maxLength="500"
                                placeholder="https://meet.example.com/interview"
                            />
                        </label>

                        <label className="field-wide">
                            Candidate instructions
                            <textarea
                                name="instructions"
                                rows="4"
                                value={
                                    form.instructions
                                }
                                onChange={handleChange}
                                maxLength="2000"
                                placeholder="Please join five minutes early."
                            />
                        </label>

                        <div className="field-wide">
                            <button
                                className="button button-primary"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Scheduling...'
                                    : 'Schedule interview'}
                            </button>
                        </div>
                    </form>
                </>
            )}

            <div className="page-heading">
                <div>
                    <h2>Department interviews</h2>

                    <p className="muted">
                        Search, filter and update scheduled
                        interviews.
                    </p>
                </div>
            </div>

            <div className="content-form">
                <label>
                    Search interviews
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={event =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Candidate, job or location"
                    />
                </label>

                <label>
                    Filter by status
                    <select
                        value={statusFilter}
                        onChange={event =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="All">
                            All statuses
                        </option>

                        <option value="Scheduled">
                            Scheduled
                        </option>

                        <option value="Rescheduled">
                            Rescheduled
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>
                </label>
            </div>

            {loading ? (
                <p className="status-message">
                    Loading interviews...
                </p>
            ) : interviews.length === 0 ? (
                <div className="empty-state">
                    <h3>No interviews scheduled</h3>

                    <p className="muted">
                        Scheduled interviews will appear
                        here.
                    </p>
                </div>
            ) : filteredInterviews.length === 0 ? (
                <div className="empty-state">
                    <h3>No matching interviews</h3>

                    <p className="muted">
                        Try changing the search text or
                        status filter.
                    </p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Job</th>
                                <th>Date and time</th>
                                <th>Duration</th>
                                <th>Location / Meeting</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredInterviews.map(
                                interview => {
                                    const canUpdate = [
                                        'Scheduled',
                                        'Rescheduled'
                                    ].includes(
                                        interview.status
                                    );

                                    const isUpdating =
                                        updatingId ===
                                        interview.id;

                                    return (
                                        <tr
                                            key={
                                                interview.id
                                            }
                                        >
                                            <td>
                                                {
                                                    interview.candidateName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    interview.jobTitle
                                                }
                                            </td>

                                            <td>
                                                {new Date(
                                                    interview.scheduledAt
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {
                                                    interview.durationMinutes
                                                }{' '}
                                                minutes
                                            </td>

                                            <td>
                                                {interview.location && (
                                                    <div>
                                                        {
                                                            interview.location
                                                        }
                                                    </div>
                                                )}

                                                {interview.meetingUrl && (
                                                    <a
                                                        href={
                                                            interview.meetingUrl
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Open meeting
                                                    </a>
                                                )}

                                                {!interview.location &&
                                                    !interview.meetingUrl &&
                                                    'Not provided'}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge badge-${interview.status?.toLowerCase()}`}
                                                >
                                                    {
                                                        interview.status
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {canUpdate ? (
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="button button-outline button-small"
                                                            disabled={
                                                                isUpdating ||
                                                                rescheduling
                                                            }
                                                            onClick={() =>
                                                                openRescheduleForm(
                                                                    interview
                                                                )
                                                            }
                                                        >
                                                            Reschedule
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="button button-primary button-small"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    interview.id,
                                                                    2,
                                                                    'mark as completed'
                                                                )
                                                            }
                                                        >
                                                            {isUpdating
                                                                ? 'Updating...'
                                                                : 'Complete'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="button button-danger button-small"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    interview.id,
                                                                    3,
                                                                    'cancel'
                                                                )
                                                            }
                                                        >
                                                            {isUpdating
                                                                ? 'Updating...'
                                                                : 'Cancel'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="muted">
                                                        No actions
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}