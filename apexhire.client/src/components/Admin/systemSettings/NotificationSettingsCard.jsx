import PropTypes from "prop-types";
import {
    Divider,
    FormControlLabel,
    Paper,
    Stack,
    Switch,
    Typography,
} from "@mui/material";

const NOTIFICATION_OPTIONS = [
    {
        name: "notifyOnNewUser",
        title: "New User Registrations",
        description:
            "Notify administrators when a new user creates an account.",
    },
    {
        name: "notifyOnNewJob",
        title: "New Job Posts",
        description:
            "Notify administrators when recruiters publish new job posts.",
    },
    {
        name: "notifyOnApplication",
        title: "New Job Applications",
        description:
            "Notify relevant users when candidates submit applications.",
    },
    {
        name: "notifyOnSecurityAlert",
        title: "Security Alerts",
        description:
            "Send notifications for suspicious logins and security events.",
    },
    {
        name: "notifyOnSystemError",
        title: "System Errors",
        description:
            "Notify administrators when critical application errors occur.",
    },
    {
        name: "enableEmailNotifications",
        title: "Email Notifications",
        description:
            "Allow the system to deliver notification messages by email.",
    },
];

export default function NotificationSettingsCard({
    settings,
    disabled = false,
    onChange,
}) {
    function handleChange(
        event
    ) {
        onChange(
            event.target.name,
            event.target.checked
        );
    }

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
                Notification Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Control which administrative and system events generate notifications.
            </Typography>

            <Stack
                spacing={0}
                divider={
                    <Divider
                        flexItem
                    />
                }
            >
                {NOTIFICATION_OPTIONS.map(
                    option => (
                        <Stack
                            key={
                                option.name
                            }
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            alignItems={{
                                xs: "flex-start",
                                sm: "center",
                            }}
                            justifyContent="space-between"
                            sx={{
                                py: 2,
                            }}
                        >
                            <Stack
                                spacing={0.5}
                                sx={{
                                    pr: {
                                        sm: 3,
                                    },
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                >
                                    {
                                        option.title
                                    }
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {
                                        option.description
                                    }
                                </Typography>
                            </Stack>

                            <FormControlLabel
                                sx={{
                                    m: 0,
                                    flexShrink: 0,
                                }}
                                control={
                                    <Switch
                                        name={
                                            option.name
                                        }
                                        checked={
                                            Boolean(
                                                settings[
                                                    option
                                                        .name
                                                ]
                                            )
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            disabled
                                        }
                                        inputProps={{
                                            "aria-label":
                                                option.title,
                                        }}
                                    />
                                }
                                label={
                                    settings[
                                        option
                                            .name
                                    ]
                                        ? "Enabled"
                                        : "Disabled"
                                }
                            />
                        </Stack>
                    )
                )}
            </Stack>
        </Paper>
    );
}

NotificationSettingsCard.propTypes = {
    settings: PropTypes.shape({
        notifyOnNewUser:
            PropTypes.bool.isRequired,
        notifyOnNewJob:
            PropTypes.bool.isRequired,
        notifyOnApplication:
            PropTypes.bool.isRequired,
        notifyOnSecurityAlert:
            PropTypes.bool.isRequired,
        notifyOnSystemError:
            PropTypes.bool.isRequired,
        enableEmailNotifications:
            PropTypes.bool.isRequired,
    }).isRequired,

    disabled:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,
};
