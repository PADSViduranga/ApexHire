import {
    Dashboard,
    People,
    Business,
    Apartment,
    Security,
    ReceiptLong,
    BarChart,
    Analytics,
    Settings,
    Person
} from "@mui/icons-material";

import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";

import { NavLink } from "react-router-dom";

import "./AdminSidebar.css";

const drawerWidth = 280;

const menuItems = [
    {
        text: "Dashboard",
        icon: <Dashboard />,
        path: "/admin/dashboard"
    },
    {
        text: "Users",
        icon: <People />,
        path: "/admin/users"
    },
    {
        text: "Organizations",
        icon: <Business />,
        path: "/admin/organizations"
    },
    {
        text: "Departments",
        icon: <Apartment />,
        path: "/admin/departments"
    },
    {
        text: "Roles",
        icon: <Security />,
        path: "/admin/roles"
    },
    {
        text: "Audit Logs",
        icon: <ReceiptLong />,
        path: "/admin/audit-logs"
    },
    {
        text: "Reports",
        icon: <BarChart />,
        path: "/admin/reports"
    },
    {
        text: "Analytics",
        icon: <Analytics />,
        path: "/admin/analytics"
    },
    {
        text: "System Settings",
        icon: <Settings />,
        path: "/admin/settings"
    },
    {
        text: "Profile",
        icon: <Person />,
        path: "/admin/profile"
    }
];

export default function AdminSidebar() {
    return (
        <Box
            component="aside"
            className="condo-admin-sidebar"
            sx={{
                width: drawerWidth,
                minWidth: drawerWidth,
                flexShrink: 0
            }}
        >
            <div className="condo-sidebar-decoration condo-sidebar-decoration-one" />
            <div className="condo-sidebar-decoration condo-sidebar-decoration-two" />

            <div className="condo-sidebar-brand">
                <div className="condo-brand-logo">
                    <span className="condo-brand-logo-a">A</span>
                    <span className="condo-brand-logo-h">H</span>
                </div>

                <div className="condo-brand-content">
                    <Typography
                        component="h1"
                        className="condo-brand-title"
                    >
                        ApexHire
                    </Typography>

                    <Typography
                        component="p"
                        className="condo-brand-subtitle"
                    >
                        Admin Control Center
                    </Typography>
                </div>
            </div>

            <Divider className="condo-sidebar-divider" />

            <div className="condo-sidebar-section-label">
                <span>MANAGEMENT</span>
                <div />
            </div>

            <List className="condo-sidebar-menu">
                {menuItems.map((item, index) => (
                    <ListItemButton
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        className="condo-sidebar-menu-item"
                        style={{
                            "--menu-index": index
                        }}
                    >
                        <span className="condo-menu-active-indicator" />

                        <ListItemIcon className="condo-sidebar-menu-icon">
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                            className="condo-sidebar-menu-text"
                        />

                        <span className="condo-menu-arrow">
                            ›
                        </span>
                    </ListItemButton>
                ))}
            </List>

            <div className="condo-sidebar-footer">
                <div className="condo-sidebar-footer-icon">
                    <Security />
                </div>

                <div>
                    <Typography className="condo-sidebar-footer-title">
                        Secure Administration
                    </Typography>

                    <Typography className="condo-sidebar-footer-text">
                        ApexHire Management System
                    </Typography>
                </div>
            </div>
        </Box>
    );
}
