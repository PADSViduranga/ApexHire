import PropTypes from "prop-types";
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    AVAILABLE_CURRENCIES,
    AVAILABLE_DATE_FORMATS,
    AVAILABLE_LANGUAGES,
    AVAILABLE_TIMEZONES,
    SYSTEM_SETTINGS_VALIDATION,
} from "../../../utils/systemSettingsConstants";

export default function GeneralSettingsCard({
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
                General Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Configure the main application identity, localization, and display preferences.
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
                        name="siteName"
                        label="Site Name"
                        value={
                            settings.siteName
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.siteName
                        )}
                        helperText={
                            errors.siteName
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SITE_NAME_MAX_LENGTH,
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            disabled
                        }
                    >
                        <InputLabel id="system-language-label">
                            Language
                        </InputLabel>

                        <Select
                            labelId="system-language-label"
                            name="language"
                            label="Language"
                            value={
                                settings.language
                            }
                            onChange={
                                handleChange
                            }
                        >
                            {AVAILABLE_LANGUAGES.map(
                                language => (
                                    <MenuItem
                                        key={
                                            language
                                        }
                                        value={
                                            language
                                        }
                                    >
                                        {language}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        name="siteDescription"
                        label="Site Description"
                        value={
                            settings.siteDescription
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        error={Boolean(
                            errors.siteDescription
                        )}
                        helperText={
                            errors.siteDescription ||
                            `${settings.siteDescription.length}/${SYSTEM_SETTINGS_VALIDATION.SITE_DESCRIPTION_MAX_LENGTH}`
                        }
                        inputProps={{
                            maxLength:
                                SYSTEM_SETTINGS_VALIDATION
                                    .SITE_DESCRIPTION_MAX_LENGTH,
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            disabled
                        }
                    >
                        <InputLabel id="system-timezone-label">
                            Timezone
                        </InputLabel>

                        <Select
                            labelId="system-timezone-label"
                            name="timezone"
                            label="Timezone"
                            value={
                                settings.timezone
                            }
                            onChange={
                                handleChange
                            }
                        >
                            {AVAILABLE_TIMEZONES.map(
                                timezone => (
                                    <MenuItem
                                        key={
                                            timezone
                                        }
                                        value={
                                            timezone
                                        }
                                    >
                                        {timezone}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            disabled
                        }
                    >
                        <InputLabel id="system-date-format-label">
                            Date Format
                        </InputLabel>

                        <Select
                            labelId="system-date-format-label"
                            name="dateFormat"
                            label="Date Format"
                            value={
                                settings.dateFormat
                            }
                            onChange={
                                handleChange
                            }
                        >
                            {AVAILABLE_DATE_FORMATS.map(
                                format => (
                                    <MenuItem
                                        key={
                                            format
                                        }
                                        value={
                                            format
                                        }
                                    >
                                        {format}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            disabled
                        }
                    >
                        <InputLabel id="system-currency-label">
                            Currency
                        </InputLabel>

                        <Select
                            labelId="system-currency-label"
                            name="currency"
                            label="Currency"
                            value={
                                settings.currency
                            }
                            onChange={
                                handleChange
                            }
                        >
                            {AVAILABLE_CURRENCIES.map(
                                currency => (
                                    <MenuItem
                                        key={
                                            currency
                                        }
                                        value={
                                            currency
                                        }
                                    >
                                        {currency}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
    );
}

GeneralSettingsCard.propTypes = {
    settings: PropTypes.shape({
        siteName:
            PropTypes.string.isRequired,
        siteDescription:
            PropTypes.string.isRequired,
        language:
            PropTypes.string.isRequired,
        timezone:
            PropTypes.string.isRequired,
        dateFormat:
            PropTypes.string.isRequired,
        currency:
            PropTypes.string.isRequired,
    }).isRequired,

    errors:
        PropTypes.object,

    disabled:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,
};
