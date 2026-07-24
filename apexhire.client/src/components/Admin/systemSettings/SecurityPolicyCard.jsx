import PropTypes from "prop-types";
import {
    FormControlLabel,
    Grid,
    InputAdornment,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    SYSTEM_SETTINGS_VALIDATION,
} from "../../../utils/systemSettingsConstants";

export default function SecurityPolicyCard({
    settings,
    errors = {},
    disabled = false,
    onChange,
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
                Security Policy
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Configure password requirements, account lockout rules, and session security.
            </Typography>

            <Grid
                container
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        type="number"
                        name="passwordMinLength"
                        label="Minimum Password Length"
                        value={
                            settings.passwordMinLength
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.passwordMinLength
                        )}
                        helperText={
                            errors.passwordMinLength
                        }
                        inputProps={{
                            min:
                                SYSTEM_SETTINGS_VALIDATION
                                    .PASSWORD_MIN,
                            max:
                                SYSTEM_SETTINGS_VALIDATION
                                    .PASSWORD_MAX,
                            step: 1,
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    Characters
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
                        type="number"
                        name="accountLockoutAttempts"
                        label="Failed Login Attempts"
                        value={
                            settings.accountLockoutAttempts
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.accountLockoutAttempts
                        )}
                        helperText={
                            errors.accountLockoutAttempts
                        }
                        inputProps={{
                            min:
                                SYSTEM_SETTINGS_VALIDATION
                                    .LOCKOUT_ATTEMPTS_MIN,
                            max:
                                SYSTEM_SETTINGS_VALIDATION
                                    .LOCKOUT_ATTEMPTS_MAX,
                            step: 1,
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    Attempts
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
                        type="number"
                        name="accountLockoutMinutes"
                        label="Account Lockout Duration"
                        value={
                            settings.accountLockoutMinutes
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.accountLockoutMinutes
                        )}
                        helperText={
                            errors.accountLockoutMinutes
                        }
                        inputProps={{
                            min: 1,
                            max: 1440,
                            step: 1,
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    Minutes
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
                        type="number"
                        name="sessionTimeoutMinutes"
                        label="Session Timeout"
                        value={
                            settings.sessionTimeoutMinutes
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.sessionTimeoutMinutes
                        )}
                        helperText={
                            errors.sessionTimeoutMinutes
                        }
                        inputProps={{
                            min:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SESSION_TIMEOUT_MIN,
                            max:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SESSION_TIMEOUT_MAX,
                            step: 1,
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    Minutes
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <Stack
                        spacing={1}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    name="requireUppercase"
                                    checked={Boolean(
                                        settings.requireUppercase
                                    )}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        disabled
                                    }
                                />
                            }
                            label="Require at least one uppercase letter"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name="requireLowercase"
                                    checked={Boolean(
                                        settings.requireLowercase
                                    )}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        disabled
                                    }
                                />
                            }
                            label="Require at least one lowercase letter"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name="requireNumber"
                                    checked={Boolean(
                                        settings.requireNumber
                                    )}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        disabled
                                    }
                                />
                            }
                            label="Require at least one number"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name="requireSpecialCharacter"
                                    checked={Boolean(
                                        settings.requireSpecialCharacter
                                    )}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        disabled
                                    }
                                />
                            }
                            label="Require at least one special character"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name="enableTwoFactorAuthentication"
                                    checked={Boolean(
                                        settings.enableTwoFactorAuthentication
                                    )}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        disabled
                                    }
                                />
                            }
                            label="Enable two-factor authentication"
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
}

SecurityPolicyCard.propTypes = {
    settings: PropTypes.shape({
        passwordMinLength:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,

        accountLockoutAttempts:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,

        accountLockoutMinutes:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,

        sessionTimeoutMinutes:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,

        requireUppercase:
            PropTypes.bool.isRequired,

        requireLowercase:
            PropTypes.bool.isRequired,

        requireNumber:
            PropTypes.bool.isRequired,

        requireSpecialCharacter:
            PropTypes.bool.isRequired,

        enableTwoFactorAuthentication:
            PropTypes.bool.isRequired,
    }).isRequired,

    errors:
        PropTypes.object,

    disabled:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,
};
