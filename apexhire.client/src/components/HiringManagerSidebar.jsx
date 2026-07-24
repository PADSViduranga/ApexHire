import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/HiringManagerSidebar.css";

export default function HiringManagerSidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <aside className="hm-sidebar">

            <div className="hm-sidebar-header">

                <div className="hm-logo">
                    AH
                </div>

                <div>
                    <h2>ApexHire</h2>

                    <span>
                        Hiring Manager
                    </span>
                </div>

            </div>

            <div className="hm-user-card">

                <div className="hm-avatar">
                    {user?.fullName?.charAt(0)?.toUpperCase() ?? "H"}
                </div>

                <div>

                    <strong>
                        {user?.fullName ?? "Hiring Manager"}
                    </strong>

                    <small>
                        {user?.email}
                    </small>

                </div>

            </div>

            <nav className="hm-menu">

                <NavLink
                    to="/hiring-manager/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    🏠 Dashboard
                </NavLink>

                <NavLink
                    to="/hiring-manager/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    👤 My Profile
                </NavLink>

                <NavLink
                    to="/hiring-manager/jobs"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    💼 Jobs
                </NavLink>

                <NavLink
                    to="/hiring-manager/applications"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    📄 Applications
                </NavLink>

                <NavLink
                    to="/hiring-manager/interviews"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    📅 Interviews
                </NavLink>

                <NavLink
                    to="/hiring-manager/feedback"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    📝 Feedback
                </NavLink>

                <NavLink
                    to="/hiring-manager/analytics"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    📊 Analytics
                </NavLink>

                <NavLink
                    to="/hiring-manager/settings"
                    className={({ isActive }) =>
                        isActive
                            ? "hm-link active"
                            : "hm-link"
                    }
                >
                    ⚙️ Settings
                </NavLink>

            </nav>

            <div className="hm-sidebar-footer">

                <button
                    className="hm-logout-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </div>

        </aside>
    );
}
