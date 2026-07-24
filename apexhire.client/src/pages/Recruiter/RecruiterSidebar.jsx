
import {
    AddBusinessOutlined,
    AnalyticsOutlined,
    CalendarMonthOutlined,
    DashboardOutlined,
    DescriptionOutlined,
    ManageAccountsOutlined,
    SettingsOutlined,
    StarOutlineRounded,
    WorkOutlineRounded,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

import "./RecruiterSidebar.css";

const navigationItems = [
    {
        to: "/recruiter/dashboard",
        label: "Dashboard",
        description: "Recruitment overview",
        icon: DashboardOutlined,
    },
    {
        to: "/recruiter/profile",
        label: "My Profile",
        description: "Manage your account",
        icon: ManageAccountsOutlined,
    },
    {
        to: "/recruiter/jobs",
        label: "Manage Jobs",
        description: "View and update jobs",
        icon: WorkOutlineRounded,
    },
    {
        to: "/recruiter/create-job",
        label: "Create Job",
        description: "Publish a new vacancy",
        icon: AddBusinessOutlined,
    },
    {
        to: "/recruiter/applications",
        label: "Applications",
        description: "Review candidates",
        icon: DescriptionOutlined,
    },
    {
        to: "/recruiter/interviews",
        label: "Interviews",
        description: "Manage schedules",
        icon: CalendarMonthOutlined,
    },
    {
        to: "/recruiter/feedback",
        label: "Feedback",
        description: "Interview evaluations",
        icon: StarOutlineRounded,
    },
    {
        to: "/recruiter/analytics",
        label: "Analytics",
        description: "Recruitment performance",
        icon: AnalyticsOutlined,
    },
];

export default function RecruiterSidebar() {
    return (
        <aside className="recruiter-sidebar">
            <div className="recruiter-sidebar__glow" />

            <div className="recruiter-sidebar__brand">
                <div className="recruiter-sidebar__logo">
                    AH
                </div>

                <div className="recruiter-sidebar__brand-content">
                    <span className="recruiter-sidebar__brand-name">
                        ApexHire
                    </span>

                    <span className="recruiter-sidebar__brand-role">
                        Recruiter Portal
                    </span>
                </div>
            </div>

            <div className="recruiter-sidebar__section">
                <span className="recruiter-sidebar__section-title">
                    Workspace
                </span>

                <nav
                    className="recruiter-sidebar__navigation"
                    aria-label="Recruiter navigation"
                >
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    isActive
                                        ? "recruiter-sidebar__link recruiter-sidebar__link--active"
                                        : "recruiter-sidebar__link"
                                }
                                style={{
                                    "--sidebar-item-index": index,
                                }}
                            >
                                <span className="recruiter-sidebar__active-line" />

                                <span className="recruiter-sidebar__icon">
                                    <Icon fontSize="small" />
                                </span>

                                <span className="recruiter-sidebar__link-content">
                                    <span className="recruiter-sidebar__link-label">
                                        {item.label}
                                    </span>

                                    <span className="recruiter-sidebar__link-description">
                                        {item.description}
                                    </span>
                                </span>

                                <span className="recruiter-sidebar__arrow">
                                    ›
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="recruiter-sidebar__footer">
                <NavLink
                    to="/recruiter/settings"
                    className={({ isActive }) =>
                        isActive
                            ? "recruiter-sidebar__settings recruiter-sidebar__settings--active"
                            : "recruiter-sidebar__settings"
                    }
                >
                    <span className="recruiter-sidebar__settings-icon">
                        <SettingsOutlined fontSize="small" />
                    </span>

                    <span>
                        <strong>Settings</strong>
                        <small>Portal preferences</small>
                    </span>
                </NavLink>

                <div className="recruiter-sidebar__support">
                    <span className="recruiter-sidebar__support-dot" />

                    <div>
                        <strong>System operational</strong>
                        <span>All services available</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

