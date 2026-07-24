import PropTypes from "prop-types";
import {
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ADMIN_PROFILE_VALIDATION,
} from "../../../utils/adminProfileConstants";

export default function PersonalInformationCard({
    form,
    errors = {},
    disabled = false,
    onChange,
}) {
    function handleChange(event) {
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
                Personal Information
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Update the personal details shown on your administrator profile.
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
                        name="firstName"
                        label="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(
                            errors.firstName
                        )}
                        helperText={
                            errors.firstName
                        }
                        inputProps={{
                            maxLength:
                                ADMIN_PROFILE_VALIDATION
                                    .FIRST_NAME_MAX_LENGTH,
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
                        name="lastName"
                        label="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(
                            errors.lastName
                        )}
                        helperText={
                            errors.lastName
                        }
                        inputProps={{
                            maxLength:
                                ADMIN_PROFILE_VALIDATION
                                    .LAST_NAME_MAX_LENGTH,
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
                        name="phoneNumber"
                        label="Phone Number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(
                            errors.phoneNumber
                        )}
                        helperText={
                            errors.phoneNumber
                        }
                        inputProps={{
                            maxLength:
                                ADMIN_PROFILE_VALIDATION
                                    .PHONE_MAX_LENGTH,
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
                        name="jobTitle"
                        label="Job Title"
                        value={form.jobTitle}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(
                            errors.jobTitle
                        )}
                        helperText={
                            errors.jobTitle
                        }
                        inputProps={{
                            maxLength:
                                ADMIN_PROFILE_VALIDATION
                                    .JOB_TITLE_MAX_LENGTH,
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        name="location"
                        label="Location"
                        value={form.location}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(
                            errors.location
                        )}
                        helperText={
                            errors.location
                        }
                        inputProps={{
                            maxLength:
                                ADMIN_PROFILE_VALIDATION
                                    .LOCATION_MAX_LENGTH,
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        name="bio"
                        label="Bio"
                        value={form.bio}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(
                            errors.bio
                        )}
                        helperText={
                            errors.bio ||
                            `${form.bio.length}/${ADMIN_PROFILE_VALIDATION.BIO_MAX_LENGTH}`
                        }
                        inputProps={{
                            maxLength:
                                ADMIN_PROFILE_VALIDATION
                                    .BIO_MAX_LENGTH,
                        }}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

PersonalInformationCard.propTypes = {
    form: PropTypes.shape({
        firstName:
            PropTypes.string.isRequired,
        lastName:
            PropTypes.string.isRequired,
        phoneNumber:
            PropTypes.string.isRequired,
        jobTitle:
            PropTypes.string.isRequired,
        location:
            PropTypes.string.isRequired,
        bio:
            PropTypes.string.isRequired,
    }).isRequired,

    errors:
        PropTypes.object,

    disabled:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,
};
