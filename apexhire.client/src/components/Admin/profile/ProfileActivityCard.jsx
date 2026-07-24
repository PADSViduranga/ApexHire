import PropTypes from "prop-types";
import {
    Box,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import {
    formatProfileDateTime,
} from "../../../utils/adminProfileHelpers";

function getActivityIcon(
    activityType
) {
    const normalizedType =
        String(activityType || "")
            .trim()
            .toLowerCase();

    if (
        normalizedType.includes("login") ||
        normalizedType.includes("sign in")
    ) {
        return <LoginOutlinedIcon />;
    }

    if (
        normalizedType.includes("logout") ||
        normalizedType.includes("sign out")
    ) {
        return <LogoutOutlinedIcon />;
    }

    if (
        normalizedType.includes("password")
    ) {
        return <LockResetOutlinedIcon />;
    }

    if (
        normalizedType.includes("profile")
    ) {
        return <PersonOutlineOutlinedIcon />;
    }

    if (
        normalizedType.includes("security") ||
        normalizedType.includes("session")
    ) {
        return <SecurityOutlinedIcon />;
    }

    return <HistoryOutlinedIcon />;
}

export default function ProfileActivityCard({
    activities = [],
}) {
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
            <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
            >
                Recent Activity
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Review recent security and profile activity for your administrator account.
            </Typography>

            {activities.length === 0 ? (
                <Box
                    sx={{
                        py: 5,
                        textAlign: "center",
                    }}
                >
                    <HistoryOutlinedIcon
                        color="disabled"
                        sx={{
                            fontSize: 48,
                            mb: 1.5,
                        }}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        No recent activity
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Your recent account activity will appear here.
                    </Typography>
                </Box>
            ) : (
                <Stack
                    spacing={0}
                    divider={
                        <Divider flexItem />
                    }
                >
                    {activities.map(
                        activity => (
                            <Box
                                key={activity.id}
                                sx={{
                                    py: 2.25,
                                    display: "flex",
                                    gap: 2,
                                    alignItems:
                                        "flex-start",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 2,
                                        display: "grid",
                                        placeItems:
                                            "center",
                                        bgcolor:
                                            "action.hover",
                                        color:
                                            "text.secondary",
                                        flexShrink: 0,
                                    }}
                                >
                                    {getActivityIcon(
                                        activity.type
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                    >
                                        {activity.title ||
                                            "Account Activity"}
                                    </Typography>

                                    {activity.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {activity.description}
                                        </Typography>
                                    )}

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={{
                                            xs: 0.5,
                                            sm: 1.5,
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {formatProfileDateTime(
                                                activity.createdAt
                                            )}
                                        </Typography>

                                        {activity.ipAddress && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                IP:{" "}
                                                {activity.ipAddress}
                                            </Typography>
                                        )}

                                        {activity.location && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {activity.location}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        )
                    )}
                </Stack>
            )}
        </Paper>
    );
}

ProfileActivityCard.propTypes = {
    activities:
        PropTypes.arrayOf(
            PropTypes.shape({
                id:
                    PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                    ]).isRequired,
                type:
                    PropTypes.string,
                title:
                    PropTypes.string,
                description:
                    PropTypes.string,
                ipAddress:
                    PropTypes.string,
                location:
                    PropTypes.string,
                createdAt:
                    PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                        PropTypes.instanceOf(
                            Date
                        ),
                    ]),
            })
        ),
};
