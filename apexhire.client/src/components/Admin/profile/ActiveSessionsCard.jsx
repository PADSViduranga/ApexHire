import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined";
import DevicesOtherOutlinedIcon from "@mui/icons-material/DevicesOtherOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import {
    formatProfileDateTime,
} from "../../../utils/adminProfileHelpers";

function getDeviceIcon(
    deviceType
) {
    const normalizedType =
        String(deviceType || "")
            .trim()
            .toLowerCase();

    if (
        normalizedType.includes("mobile") ||
        normalizedType.includes("phone")
    ) {
        return (
            <PhoneAndroidOutlinedIcon />
        );
    }

    if (
        normalizedType.includes("tablet")
    ) {
        return (
            <TabletMacOutlinedIcon />
        );
    }

    if (
        normalizedType.includes("desktop") ||
        normalizedType.includes("computer") ||
        normalizedType.includes("laptop")
    ) {
        return (
            <ComputerOutlinedIcon />
        );
    }

    return (
        <DevicesOtherOutlinedIcon />
    );
}

export default function ActiveSessionsCard({
    sessions = [],
    revokingSessionId = null,
    onRevokeSession,
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
                Active Sessions
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Review the devices currently signed in to your administrator account.
            </Typography>

            {sessions.length === 0 ? (
                <Box
                    sx={{
                        py: 5,
                        textAlign: "center",
                    }}
                >
                    <DevicesOtherOutlinedIcon
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
                        No active sessions
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Active device sessions will appear here.
                    </Typography>
                </Box>
            ) : (
                <Stack
                    divider={
                        <Divider flexItem />
                    }
                    spacing={0}
                >
                    {sessions.map(
                        session => {
                            const isRevoking =
                                revokingSessionId ===
                                session.id;

                            return (
                                <Box
                                    key={
                                        session.id
                                    }
                                    sx={{
                                        py: 2.5,
                                        display: "flex",
                                        alignItems: {
                                            xs: "flex-start",
                                            md: "center",
                                        },
                                        justifyContent:
                                            "space-between",
                                        flexDirection: {
                                            xs: "column",
                                            md: "row",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="flex-start"
                                    >
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                display: "grid",
                                                placeItems:
                                                    "center",
                                                borderRadius: 2,
                                                bgcolor:
                                                    "action.hover",
                                                color:
                                                    "text.secondary",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getDeviceIcon(
                                                session.deviceType
                                            )}
                                        </Box>

                                        <Box>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                flexWrap="wrap"
                                                useFlexGap
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={700}
                                                >
                                                    {session.deviceName ||
                                                        session.browser ||
                                                        "Unknown Device"}
                                                </Typography>

                                                {session.isCurrent && (
                                                    <Chip
                                                        size="small"
                                                        label="Current Session"
                                                        color="success"
                                                    />
                                                )}
                                            </Stack>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {[
                                                    session.browser,
                                                    session.operatingSystem,
                                                ]
                                                    .filter(
                                                        Boolean
                                                    )
                                                    .join(
                                                        " • "
                                                    ) ||
                                                    "Device details unavailable"}
                                            </Typography>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                spacing={{
                                                    xs: 0.5,
                                                    sm: 2,
                                                }}
                                                sx={{ mt: 1 }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={0.75}
                                                    alignItems="center"
                                                >
                                                    <LocationOnOutlinedIcon
                                                        sx={{
                                                            fontSize: 17,
                                                        }}
                                                        color="action"
                                                    />

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {session.location ||
                                                            session.ipAddress ||
                                                            "Unknown location"}
                                                    </Typography>
                                                </Stack>

                                                <Stack
                                                    direction="row"
                                                    spacing={0.75}
                                                    alignItems="center"
                                                >
                                                    <AccessTimeOutlinedIcon
                                                        sx={{
                                                            fontSize: 17,
                                                        }}
                                                        color="action"
                                                    />

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Last active{" "}
                                                        {formatProfileDateTime(
                                                            session.lastActiveAt
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    {!session.isCurrent && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={
                                                <LogoutOutlinedIcon />
                                            }
                                            disabled={
                                                isRevoking
                                            }
                                            onClick={() =>
                                                onRevokeSession(
                                                    session.id
                                                )
                                            }
                                        >
                                            {isRevoking
                                                ? "Revoking..."
                                                : "Revoke"}
                                        </Button>
                                    )}
                                </Box>
                            );
                        }
                    )}
                </Stack>
            )}
        </Paper>
    );
}

ActiveSessionsCard.propTypes = {
    sessions:
        PropTypes.arrayOf(
            PropTypes.shape({
                id:
                    PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                    ]).isRequired,
                deviceName:
                    PropTypes.string,
                deviceType:
                    PropTypes.string,
                browser:
                    PropTypes.string,
                operatingSystem:
                    PropTypes.string,
                location:
                    PropTypes.string,
                ipAddress:
                    PropTypes.string,
                lastActiveAt:
                    PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                        PropTypes.instanceOf(
                            Date
                        ),
                    ]),
                isCurrent:
                    PropTypes.bool,
            })
        ),

    revokingSessionId:
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

    onRevokeSession:
        PropTypes.func.isRequired,
};
