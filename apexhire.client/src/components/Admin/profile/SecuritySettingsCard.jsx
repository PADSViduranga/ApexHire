import PropTypes from "prop-types";
import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";

export default function SecuritySettingsCard({
    activeSessionCount = 0,
    isChangingPassword = false,
    isRevokingOtherSessions = false,
    onOpenPasswordForm,
    onRevokeOtherSessions,
}) {
    const hasOtherSessions =
        activeSessionCount > 1;

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
                Security Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Manage your password and protect access to your administrator account.
            </Typography>

            <Stack spacing={2.5}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 2,
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                    >
                        <LockResetOutlinedIcon
                            color="primary"
                            sx={{ mt: 0.25 }}
                        />

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Password
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Change your password regularly to keep your account secure.
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        onClick={
                            onOpenPasswordForm
                        }
                        disabled={
                            isChangingPassword
                        }
                    >
                        Change Password
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 2,
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                    >
                        <DevicesOutlinedIcon
                            color="primary"
                            sx={{ mt: 0.25 }}
                        />

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Active Sessions
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {activeSessionCount === 1
                                    ? "Your account is active on 1 device."
                                    : `Your account is active on ${activeSessionCount} devices.`}
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={
                            onRevokeOtherSessions
                        }
                        disabled={
                            !hasOtherSessions ||
                            isRevokingOtherSessions
                        }
                    >
                        {isRevokingOtherSessions
                            ? "Revoking..."
                            : "Sign Out Other Devices"}
                    </Button>
                </Box>

                {!hasOtherSessions && (
                    <Alert severity="success">
                        No other active sessions were found.
                    </Alert>
                )}
            </Stack>
        </Paper>
    );
}

SecuritySettingsCard.propTypes = {
    activeSessionCount:
        PropTypes.number,

    isChangingPassword:
        PropTypes.bool,

    isRevokingOtherSessions:
        PropTypes.bool,

    onOpenPasswordForm:
        PropTypes.func.isRequired,

    onRevokeOtherSessions:
        PropTypes.func.isRequired,
};
