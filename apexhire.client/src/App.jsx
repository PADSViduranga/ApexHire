import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import HiringManagerLayout from "./components/HiringManagerLayout";

import MainLayout from "./layouts/MainLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/Jobs/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import CandidateProfilePage
    from "./pages/CandidateProfile/CandidateProfilePage";

import MyApplicationsPage
    from "./pages/MyApplicationsPage";

import MyInterviewsPage
    from "./pages/MyInterviewsPage";

import CandidateInterviewFeedbackPage
    from "./pages/CandidateInterviewFeedbackPage";

import StaffApplicationsPage
    from "./pages/StaffApplicationsPage";

import InterviewManagementPage
    from "./pages/InterviewManagementPage";

/* Recruiter */

import RecruiterDashboard
    from "./pages/Recruiter/Dashboard";

import RecruiterProfile
    from "./pages/Recruiter/Profile";

import RecruiterJobs
    from "./pages/Recruiter/Jobs";

import RecruiterCreateJob
    from "./pages/Recruiter/CreateJob";

import RecruiterEditJob
    from "./pages/Recruiter/EditJob";

import RecruiterApplications
    from "./pages/Recruiter/Applications";

import RecruiterFeedback
    from "./pages/Recruiter/Feedback";

import RecruiterAnalytics
    from "./pages/Recruiter/Analytics";

import RecruiterSettings
    from "./pages/Recruiter/Settings";

/* Hiring Manager */

import HiringManagerDashboard
    from "./pages/hiringManager/Dashboard";

import HiringManagerProfile
    from "./pages/hiringManager/Profile";

import HiringManagerApplications
    from "./pages/hiringManager/Applications";

import HiringManagerInterviews
    from "./pages/hiringManager/Interviews";

import HiringManagerFeedback
    from "./pages/hiringManager/Feedback";

import HiringManagerAnalytics
    from "./pages/hiringManager/Analytics";

import HiringManagerSettings
    from "./pages/hiringManager/Settings";

/* Administrator */

import AdminDashboard
    from "./pages/Admin/Dashboard";

import AdminUsers
    from "./pages/Admin/Users";

import AdminOrganizations
    from "./pages/Admin/Organizations";

import AdminDepartments
    from "./pages/Admin/Departments";

import AdminRoles
    from "./pages/Admin/Roles";

import AdminAuditLogs
    from "./pages/Admin/AuditLogs";

import AdminReports
    from "./pages/Admin/Reports";

import AdminAnalytics
    from "./pages/Admin/Analytics";

import AdminSystemSettings
    from "./pages/Admin/SystemSettings";

import AdminProfile
    from "./pages/Admin/Profile";

import "./App.css";

export default function App() {
    return (
        <Routes>

            {/* Public and Candidate Routes */}

            <Route element={<MainLayout />}>

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/jobs"
                    element={<JobsPage />}
                />

                <Route
                    path="/jobs/:id"
                    element={<JobDetailsPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Candidate */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Candidate"]}
                        >
                            <CandidateProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Candidate"]}
                        >
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/interviews"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Candidate"]}
                        >
                            <MyInterviewsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/interviews/:interviewId/feedback"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Candidate"]}
                        >
                            <CandidateInterviewFeedbackPage />
                        </ProtectedRoute>
                    }
                />

                {/* Shared Staff */}

                <Route
                    path="/staff/applications"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Recruiter",
                                "HiringManager"
                            ]}
                        >
                            <StaffApplicationsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/interviews"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "HiringManager"
                            ]}
                        >
                            <InterviewManagementPage />
                        </ProtectedRoute>
                    }
                />

            </Route>

            {/* Recruiter Routes */}

            <Route
                path="/recruiter"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "Recruiter"
                        ]}
                    >
                        <RecruiterLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<RecruiterDashboard />}
                />

                <Route
                    path="profile"
                    element={<RecruiterProfile />}
                />

                <Route
                    path="jobs"
                    element={<RecruiterJobs />}
                />

                <Route
                    path="create-job"
                    element={<RecruiterCreateJob />}
                />

                <Route
                    path="edit-job/:jobId"
                    element={<RecruiterEditJob />}
                />

                <Route
                    path="applications"
                    element={<RecruiterApplications />}
                />

                <Route
                    path="feedback"
                    element={<RecruiterFeedback />}
                />

                <Route
                    path="analytics"
                    element={<RecruiterAnalytics />}
                />

                <Route
                    path="settings"
                    element={<RecruiterSettings />}
                />

            </Route>

            {/* Hiring Manager Routes */}

            <Route
                path="/hiring-manager"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "HiringManager"
                        ]}
                    >
                        <HiringManagerLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<HiringManagerDashboard />}
                />

                <Route
                    path="profile"
                    element={<HiringManagerProfile />}
                />

                <Route
                    path="applications"
                    element={<HiringManagerApplications />}
                />

                <Route
                    path="interviews"
                    element={<HiringManagerInterviews />}
                />

                <Route
                    path="feedback"
                    element={<HiringManagerFeedback />}
                />

                <Route
                    path="analytics"
                    element={<HiringManagerAnalytics />}
                />

                <Route
                    path="settings"
                    element={<HiringManagerSettings />}
                />

            </Route>

            {/* Administrator Routes */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "Admin"
                        ]}
                    >
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                <Route
                    path="organizations"
                    element={<AdminOrganizations />}
                />

                <Route
                    path="departments"
                    element={<AdminDepartments />}
                />

                <Route
                    path="roles"
                    element={<AdminRoles />}
                />

                <Route
                    path="audit-logs"
                    element={<AdminAuditLogs />}
                />

                <Route
                    path="reports"
                    element={<AdminReports />}
                />

                <Route
                    path="analytics"
                    element={<AdminAnalytics />}
                />

                <Route
                    path="settings"
                    element={<AdminSystemSettings />}
                />

                <Route
                    path="profile"
                    element={<AdminProfile />}
                />

            </Route>

            {/* Unknown Route */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}
