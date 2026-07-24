import PropTypes from "prop-types";
import {
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    SYSTEM_SETTINGS_VALIDATION,
} from "../../../utils/systemSettingsConstants";

export default function OrganizationSettingsCard({
    settings,
    errors = {},
    disabled = false,
    onChange,
}) {
    function handleChange(
        event
    ) {
        onChange(
            event.target.name,
            event.target.value
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
                Organization Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Manage the organization details displayed across the platform.
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
                        required
                        name="organizationName"
                        label="Organization Name"
                        value={
                            settings.organizationName
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.organizationName
                        )}
                        helperText={
                            errors.organizationName
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .ORGANIZATION_NAME_MAX_LENGTH,
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
                        required
                        type="email"
                        name="organizationEmail"
                        label="Organization Email"
                        value={
                            settings.organizationEmail
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.organizationEmail
                        )}
                        helperText={
                            errors.organizationEmail
                        }
                        autoComplete="organization-email"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        type="tel"
                        name="organizationPhone"
                        label="Organization Phone"
                        value={
                            settings.organizationPhone
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.organizationPhone
                        )}
                        helperText={
                            errors.organizationPhone
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .ORGANIZATION_PHONE_MAX_LENGTH,
                        }}
                        autoComplete="organization-tel"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        name="organizationAddress"
                        label="Organization Address"
                        value={
                            settings.organizationAddress
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.organizationAddress
                        )}
                        helperText={
                            errors.organizationAddress ||
                            `${settings.organizationAddress.length}/${SYSTEM_SETTINGS_VALIDATION.ORGANIZATION_ADDRESS_MAX_LENGTH}`
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .ORGANIZATION_ADDRESS_MAX_LENGTH,
                        }}
                        autoComplete="street-address"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

OrganizationSettingsCard.propTypes = {
    settings: PropTypes.shape({
        organizationName:
            PropTypes.string.isRequired,
        organizationEmail:
            PropTypes.string.isRequired,
        organizationPhone:
            PropTypes.string.isRequired,
        organizationAddress:
            PropTypes.string.isRequired,
    }).isRequired,

    errors:
        PropTypes.object,

    disabled:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,
};
