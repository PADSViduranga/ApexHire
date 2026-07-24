import {
    Link,
} from "react-router-dom";

import "./Dashboard.css";

export default function Dashboard() {
    return (
        <div className="dashboard-page">

            <div className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">
                        Recruiter workspace
                    </p>

                    <h1>
                        Recruiter Dashboard
                    </h1>

                    <p>
                        Welcome back. Here&apos;s what&apos;s
                        happening today.
                    </p>
                </div>
            </div>

            <div className="dashboard-cards">

                <article className="dashboard-card">
                    <h2>18</h2>
                    <span>Active Jobs</span>
                </article>

                <article className="dashboard-card">
                    <h2>243</h2>
                    <span>Total Applications</span>
                </article>

                <article className="dashboard-card">
                    <h2>14</h2>
                    <span>Interviews</span>
                </article>

                <article className="dashboard-card">
                    <h2>6</h2>
                    <span>Jobs Closing Soon</span>
                </article>

            </div>

            <div className="dashboard-grid">

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">
                        <div>
                            <p className="panel-eyebrow">
                                Latest activity
                            </p>

                            <h2>
                                Recent Applications
                            </h2>
                        </div>

                        <Link
                            className="panel-link-button"
                            to="/recruiter/applications"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="dashboard-table-wrapper">

                        <table className="dashboard-table">

                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Job</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>
                                        <div className="candidate-cell">
                                            <span className="candidate-avatar">
                                                JS
                                            </span>

                                            <span>
                                                John Smith
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        Frontend Developer
                                    </td>

                                    <td>
                                        <span className="status-badge status-pending">
                                            Pending
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="candidate-cell">
                                            <span className="candidate-avatar">
                                                SW
                                            </span>

                                            <span>
                                                Sarah Wilson
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        Backend Developer
                                    </td>

                                    <td>
                                        <span className="status-badge status-reviewed">
                                            Reviewed
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="candidate-cell">
                                            <span className="candidate-avatar">
                                                DL
                                            </span>

                                            <span>
                                                David Lee
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        QA Engineer
                                    </td>

                                    <td>
                                        <span className="status-badge status-interview">
                                            Interview
                                        </span>
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </section>

                <section className="dashboard-panel dashboard-panel--actions">

                    <p className="panel-eyebrow">
                        Shortcuts
                    </p>

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quick-actions">

                        <Link
                            className="quick-action-link"
                            to="/recruiter/create-job"
                        >
                            Create Job
                        </Link>

                        <Link
                            className="quick-action-link"
                            to="/recruiter/applications"
                        >
                            View Applications
                        </Link>

                        <Link
                            className="quick-action-link"
                            to="/staff/applications"
                        >
                            Schedule Interview
                        </Link>

                        <Link
                            className="quick-action-link"
                            to="/recruiter/feedback"
                        >
                            Candidate Feedback
                        </Link>

                    </div>

                </section>

            </div>

        </div>
    );
}
