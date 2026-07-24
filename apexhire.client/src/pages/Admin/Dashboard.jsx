import {
    Analytics,
    Apartment,
    Assignment,
    Business,
    Group,
    Person,
    SupervisorAccount,
    Work
} from "@mui/icons-material";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography
} from "@mui/material";

import {
    useCallback,
    useEffect,
    useState
} from "react";

import adminService
    from "../../services/adminService";

import "../../styles/adminDashboard.css";

const cards = [
    {
        title: "Users",
        key: "totalUsers",
        icon: <Group fontSize="large" />,
        color: "#3b82f6",
        glow: "59, 130, 246"
    },
    {
        title: "Candidates",
        key: "candidates",
        icon: <Person fontSize="large" />,
        color: "#10b981",
        glow: "16, 185, 129"
    },
    {
        title: "Recruiters",
        key: "recruiters",
        icon: <SupervisorAccount fontSize="large" />,
        color: "#f59e0b",
        glow: "245, 158, 11"
    },
    {
        title: "Hiring Managers",
        key: "hiringManagers",
        icon: <Business fontSize="large" />,
        color: "#8b5cf6",
        glow: "139, 92, 246"
    },
    {
        title: "Organizations",
        key: "organizations",
        icon: <Apartment fontSize="large" />,
        color: "#06b6d4",
        glow: "6, 182, 212"
    },
    {
        title: "Jobs",
        key: "jobs",
        icon: <Work fontSize="large" />,
        color: "#f97316",
        glow: "249, 115, 22"
    },
    {
        title: "Applications",
        key: "applications",
        icon: <Assignment fontSize="large" />,
        color: "#ec4899",
        glow: "236, 72, 153"
    },
    {
        title: "Analytics",
        key: "analytics",
        icon: <Analytics fontSize="large" />,
        color: "#64748b",
        glow: "100, 116, 139"
    }
];

export default function Dashboard() {
    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        dashboard,
        setDashboard
    ] = useState({});

    const loadDashboard =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await adminService
                        .getDashboardData();

                setDashboard(
                    data ?? {}
                );
            } catch {
                setDashboard({});

                setError(
                    "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <Box className="hm-dashboard-loading">
                <Box className="hm-dashboard-loader-ring">
                    <CircularProgress
                        size={58}
                        thickness={3.5}
                    />
                </Box>

                <Typography className="hm-dashboard-loading-text">
                    Loading dashboard
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="hm-admin-dashboard">
            <Box className="hm-dashboard-background">
                <span className="hm-dashboard-orb hm-dashboard-orb-one" />
                <span className="hm-dashboard-orb hm-dashboard-orb-two" />
                <span className="hm-dashboard-orb hm-dashboard-orb-three" />
            </Box>

            <Box className="hm-dashboard-header">
                <Box>
                    <Typography
                        variant="h4"
                        className="hm-dashboard-title"
                    >
                        Administrator Dashboard
                    </Typography>

                    <Typography className="hm-dashboard-subtitle">
                        Monitor users, jobs, applications and platform activity.
                    </Typography>
                </Box>

                <Box className="hm-dashboard-live-status">
                    <span className="hm-dashboard-live-dot" />
                    System overview
                </Box>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    className="hm-dashboard-alert"
                >
                    {error}
                </Alert>
            )}

            <Grid
                container
                spacing={3}
                className="hm-dashboard-grid"
            >
                {cards.map((card, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={card.key}
                        className="hm-dashboard-grid-item"
                        sx={{
                            "--hm-card-delay":
                                `${index * 80}ms`
                        }}
                    >
                        <Card
                            className="hm-dashboard-card"
                            style={{
                                "--hm-card-color":
                                    card.color,
                                "--hm-card-glow":
                                    card.glow
                            }}
                        >
                            <CardContent className="hm-dashboard-card-content">
                                <Box className="hm-dashboard-card-top">
                                    <Box className="hm-dashboard-card-text">
                                        <Typography className="hm-dashboard-card-label">
                                            {card.title}
                                        </Typography>

                                        <Typography className="hm-dashboard-card-value">
                                            {dashboard[
                                                card.key
                                            ] ?? 0}
                                        </Typography>
                                    </Box>

                                    <Box className="hm-dashboard-icon-wrapper">
                                        <Box className="hm-dashboard-icon">
                                            {card.icon}
                                        </Box>
                                    </Box>
                                </Box>

                                <Box className="hm-dashboard-card-footer">
                                    <span className="hm-dashboard-card-line" />

                                    <Typography className="hm-dashboard-card-caption">
                                        Platform overview
                                    </Typography>
                                </Box>

                                <span className="hm-dashboard-card-shine" />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
