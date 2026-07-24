import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

function StatCard({
    title,
    value,
    icon,
    color
}) {
    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%"
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack spacing={0.5}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {value}
                        </Typography>
                    </Stack>

                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                            borderRadius: 2,
                            bgcolor: `${color}.main`,
                            color: `${color}.contrastText`
                        }}
                    >
                        {icon}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function RoleStatsCards({
    statistics = {}
}) {
    return (
        <Grid
            container
            spacing={2}
        >
            <Grid
                item
                xs={12}
                sm={6}
                lg={3}
            >
                <StatCard
                    title="Total Roles"
                    value={
                        statistics.totalRoles ?? 0
                    }
                    icon={
                        <BadgeOutlinedIcon fontSize="large" />
                    }
                    color="primary"
                />
            </Grid>

            <Grid
                item
                xs={12}
                sm={6}
                lg={3}
            >
                <StatCard
                    title="Candidate Roles"
                    value={
                        statistics.candidateRoles ?? 0
                    }
                    icon={
                        <PersonOutlineOutlinedIcon fontSize="large" />
                    }
                    color="info"
                />
            </Grid>

            <Grid
                item
                xs={12}
                sm={6}
                lg={3}
            >
                <StatCard
                    title="Staff Roles"
                    value={
                        statistics.staffRoles ?? 0
                    }
                    icon={
                        <SupervisorAccountOutlinedIcon fontSize="large" />
                    }
                    color="warning"
                />
            </Grid>

            <Grid
                item
                xs={12}
                sm={6}
                lg={3}
            >
                <StatCard
                    title="Administrator Roles"
                    value={
                        statistics.administrativeRoles ?? 0
                    }
                    icon={
                        <AdminPanelSettingsOutlinedIcon fontSize="large" />
                    }
                    color="error"
                />
            </Grid>
        </Grid>
    );
}
