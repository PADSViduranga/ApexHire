import { useState } from 'react';
import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom';

import { apiRequest } from '../api/apiClient';

const initialForm = {
    overallExperienceRating: 5,
    interviewerProfessionalismRating: 5,
    processClarityRating: 5,
    comments: ''
};

export default function CandidateInterviewFeedbackPage() {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    function handleChange(event) {
        const { name, value } = event.target;

        setForm(currentForm => ({
            ...currentForm,
            [name]:
                name === 'comments'
                    ? value
                    : Number(value)
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');

        const trimmedComments =
            form.comments.trim();

        if (!trimmedComments) {
            setError(
                'Please enter your feedback comments.'
            );
            return;
        }

        if (trimmedComments.length > 3000) {
            setError(
                'Comments cannot exceed 3000 characters.'
            );
            return;
        }

        setSubmitting(true);

        try {
            await apiRequest(
                `/api/candidate-interview-feedback/${interviewId}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        overallExperienceRating:
                            form.overallExperienceRating,

                        interviewerProfessionalismRating:
                            form.interviewerProfessionalismRating,

                        processClarityRating:
                            form.processClarityRating,

                        comments: trimmedComments
                    })
                }
            );

            navigate('/interviews', {
                replace: true,
                state: {
                    message:
                        'Interview feedback submitted successfully.'
                }
            });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        Candidate workspace
                    </p>

                    <h1>Interview feedback</h1>

                    <p className="muted">
                        Rate your interview experience and
                        provide comments about the process.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form
                className="form-card"
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label htmlFor="overallExperienceRating">
                        Overall experience
                    </label>

                    <select
                        id="overallExperienceRating"
                        name="overallExperienceRating"
                        value={form.overallExperienceRating}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very poor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label
                        htmlFor="interviewerProfessionalismRating"
                    >
                        Interviewer professionalism
                    </label>

                    <select
                        id="interviewerProfessionalismRating"
                        name="interviewerProfessionalismRating"
                        value={
                            form.interviewerProfessionalismRating
                        }
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very poor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="processClarityRating">
                        Process clarity
                    </label>

                    <select
                        id="processClarityRating"
                        name="processClarityRating"
                        value={form.processClarityRating}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very poor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="comments">
                        Comments
                    </label>

                    <textarea
                        id="comments"
                        name="comments"
                        rows={7}
                        maxLength={3000}
                        value={form.comments}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Describe your interview experience..."
                        required
                    />

                    <p className="muted">
                        {form.comments.length}/3000 characters
                    </p>
                </div>

                <div className="form-actions">
                    <Link
                        className="button button-secondary"
                        to="/interviews"
                    >
                        Cancel
                    </Link>

                    <button
                        className="button button-primary"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Submitting...'
                            : 'Submit feedback'}
                    </button>
                </div>
            </form>
        </section>
    );
}
