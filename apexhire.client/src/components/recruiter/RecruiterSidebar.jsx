import { NavLink } from "react-router-dom";

import "./RecruiterSidebar.css";

const navigationItems = [
    {
        to: "/recruiter/dashboard",
        icon: "🏠",
        label: "Dashboard",
    },
    {
        to: "/recruiter/profile",
        icon: "👤",
        label: "My Profile",
    },
    {
        to: "/recruiter/jobs",
        icon: "💼",
        label: "Manage Jobs",
    },
    {
        to: "/recruiter/create-job",
        icon: "➕",
        label: "Create Job",
    },
    {
        to: "/recruiter/applications",
        icon: "📄",
        label: "Applications",
    },
    {
        to: "/recruiter/interviews",
        icon: "📅",
        label: "Interviews",
    },
    {
        to: "/recruiter/feedback",
        icon: "⭐",
        label: "Feedback",
    },
    {
        to: "/recruiter/analytics",
        icon: "📊",
        label: "Analytics",
    },
    {
        to: "/recruiter/settings",
        icon: "⚙",
        label: "Settings",
    },
];

export default function RecruiterSidebar() {
    function getClass({ isActive }) {
        return isActive
            ? "recruiter-sidebar-link active"
            : "recruiter-sidebar-link";
    }

    return (
        <aside className="recruiter-sidebar">
            <div className="recruiter-sidebar-accent" />

            <div className="recruiter-sidebar-header">
                <div className="recruiter-sidebar-logo">
                    AH
                </div>

                <div className="recruiter-sidebar-brand">
                    <span>
                        ApexHire
                    </span>

                    <h2>
                        Recruiter Portal
                    </h2>
                </div>
            </div>

            <div className="recruiter-sidebar-section-label">
                Workspace
            </div>

            <nav
                className="recruiter-sidebar-nav"
                aria-label="Recruiter navigation"
            >
                {navigationItems.map(
                    ({
                        to,
                        icon,
                        label,
                    }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={getClass}
                        >
                            <span className="recruiter-sidebar-icon">
                                {icon}
                            </span>

                            <span className="recruiter-sidebar-text">
                                {label}
                            </span>

                            <span className="recruiter-sidebar-arrow">
                                ›
                            </span>
                        </NavLink>
                    )
                )}
            </nav>

            <div className="recruiter-sidebar-footer">
                <div className="recruiter-sidebar-footer-badge">
                    R
                </div>

                <div>
                    <strong>
                        Recruiter Account
                    </strong>

                    <span>
                        ApexHire workspace
                    </span>
                </div>
            </div>
        </aside>
    );
}
