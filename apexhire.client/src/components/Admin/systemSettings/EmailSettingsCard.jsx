import PropTypes from "prop-types";
import {
    Button,
    FormControlLabel,
    Grid,
    InputAdornment,
    Paper,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import {
    SYSTEM_SETTINGS_VALIDATION,
} from "../../../utils/systemSettingsConstants";

export default function EmailSettingsCard({
    settings,
    errors = {},
    disabled = false,
    isTesting = false,
    onChange,
    onTest,
}) {
    function handleChange(
        event
    ) {
        const {
            name,
            type,
            checked,
            value,
        } = event.target;

        onChange(
            name,
            type === "checkbox"
                ? checked
                : value
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
                Email Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Configure the SMTP server used for application emails and notifications.
            </Typography>

            <Grid
                container
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                    md={8}
                >
                    <TextField
                        fullWidth
                        name="smtpHost"
                        label="SMTP Host"
                        value={
                            settings.smtpHost
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.smtpHost
                        )}
                        helperText={
                            errors.smtpHost
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SMTP_HOST_MAX_LENGTH,
                        }}
                        placeholder="smtp.example.com"
                        autoComplete="off"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <TextField
                        fullWidth
                        type="number"
                        name="smtpPort"
                        label="SMTP Port"
                        value={
                            settings.smtpPort
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.smtpPort
                        )}
                        helperText={
                            errors.smtpPort
                        }
                        inputProps={{
                            min:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SMTP_PORT_MIN,
                            max:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SMTP_PORT_MAX,
                            step: 1,
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    Port
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        name="smtpUsername"
                        label="SMTP Username"
                        value={
                            settings.smtpUsername
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.smtpUsername
                        )}
                        helperText={
                            errors.smtpUsername
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SMTP_USERNAME_MAX_LENGTH,
                        }}
                        autoComplete="username"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        type="password"
                        name="smtpPassword"
                        label="SMTP Password"
                        value={
                            settings.smtpPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.smtpPassword
                        )}
                        helperText={
                            errors.smtpPassword
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SMTP_PASSWORD_MAX_LENGTH,
                        }}
                        autoComplete="new-password"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        name="smtpSenderName"
                        label="Sender Name"
                        value={
                            settings.smtpSenderName
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.smtpSenderName
                        )}
                        helperText={
                            errors.smtpSenderName
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SMTP_SENDER_NAME_MAX_LENGTH,
                        }}
                        placeholder="ApexHire"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        type="email"
                        name="smtpSenderEmail"
                        label="Sender Email"
                        value={
                            settings.smtpSenderEmail
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.smtpSenderEmail
                        )}
                        helperText={
                            errors.smtpSenderEmail
                        }
                        placeholder="noreply@example.com"
                        autoComplete="email"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                name="smtpUseSsl"
                                checked={
                                    Boolean(
                                        settings.smtpUseSsl
                                    )
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    disabled
                                }
                            />
                        }
                        label="Use SSL/TLS encryption"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            <SendOutlinedIcon />
                        }
                        onClick={
                            onTest
                        }
                        disabled={
                            disabled ||
                            isTesting
                        }
                    >
                        {isTesting
                            ? "Testing..."
                            : "Test Email Configuration"}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

EmailSettingsCard.propTypes = {
    settings: PropTypes.shape({
        smtpHost:
            PropTypes.string.isRequired,
        smtpPort:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
        smtpUsername:
            PropTypes.string.isRequired,
        smtpPassword:
            PropTypes.string.isRequired,
        smtpSenderName:
            PropTypes.string.isRequired,
        smtpSenderEmail:
            PropTypes.string.isRequired,
        smtpUseSsl:
            PropTypes.bool.isRequired,
    }).isRequired,

    errors:
        PropTypes.object,

    disabled:
        PropTypes.bool,

    isTesting:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,

    onTest:
        PropTypes.func.isRequired,
};
