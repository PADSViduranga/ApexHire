import PropTypes from "prop-types";
import {
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";

const INFORMATION_ITEMS = [
    {
        key: "applicationVersion",
        label: "Application Version",
        icon: CodeOutlinedIcon,
    },
    {
        key: "environment",
        label: "Environment",
        icon: CloudOutlinedIcon,
    },
    {
        key: "serverName",
        label: "Server Name",
        icon: DnsOutlinedIcon,
    },
    {
        key: "operatingSystem",
        label: "Operating System",
        icon: MemoryOutlinedIcon,
    },
    {
        key: "databaseProvider",
        label: "Database Provider",
        icon: StorageOutlinedIcon,
    },
    {
        key: "databaseName",
        label: "Database Name",
        icon: StorageOutlinedIcon,
    },
    {
        key: "serverTime",
        label: "Server Time",
        icon: AccessTimeOutlinedIcon,
    },
    {
        key: "uptime",
        label: "System Uptime",
        icon: AccessTimeOutlinedIcon,
    },
];

function formatValue(
    value
) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Not available";
    }

    return String(
        value
    );
}

export default function SystemInformationCard({
    information,
}) {
    const status =
        information.status ||
        "Unknown";

    const isHealthy =
        status
            .toLowerCase()
            .includes(
                "healthy"
            ) ||
        status
            .toLowerCase()
            .includes(
                "online"
            );

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                sx={{ mb: 3 }}
            >
                <div>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        System Information
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Current application, server, and database runtime details.
                    </Typography>
                </div>

                <Chip
                    label={`Status: ${status}`}
                    color={
                        isHealthy
                            ? "success"
                            : "warning"
                    }
                    variant="outlined"
                />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Grid
                container
                spacing={2}
            >
                {INFORMATION_ITEMS.map(
                    item => {
                        const Icon =
                            item.icon;

                        return (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={
                                    item.key
                                }
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="flex-start"
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        border: 1,
                                        borderColor:
                                            "divider",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Icon
                                        color="primary"
                                        sx={{
                                            mt: 0.25,
                                        }}
                                    />

                                    <Stack
                                        spacing={0.5}
                                        minWidth={0}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {
                                                item.label
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{
                                                wordBreak:
                                                    "break-word",
                                            }}
                                        >
                                            {formatValue(
                                                information[
                                                    item
                                                        .key
                                                ]
                                            )}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                        );
                    }
                )}
            </Grid>
        </Paper>
    );
}

SystemInformationCard.propTypes = {
    information:
        PropTypes.shape({
            applicationVersion:
                PropTypes.string,

            environment:
                PropTypes.string,

            serverName:
                PropTypes.string,

            operatingSystem:
                PropTypes.string,

            databaseProvider:
                PropTypes.string,

            databaseName:
                PropTypes.string,

            serverTime:
                PropTypes.string,

            uptime:
                PropTypes.string,

            status:
                PropTypes.string,
        }).isRequired,
};
