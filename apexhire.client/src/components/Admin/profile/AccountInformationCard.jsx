import PropTypes from "prop-types";
import {
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    formatProfileDate,
    formatProfileDateTime,
} from "../../../utils/adminProfileHelpers";

export default function AccountInformationCard({
    profile,
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
                Account Information
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Review your administrator account details and access information.
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
                        label="Email Address"
                        value={
                            profile.email || ""
                        }
                        InputProps={{
                            readOnly: true,
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
                        label="Role"
                        value={
                            profile.role || ""
                        }
                        InputProps={{
                            readOnly: true,
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
                        label="Account Status"
                        value={
                            profile.status || ""
                        }
                        InputProps={{
                            readOnly: true,
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
                        label="Organization"
                        value={
                            profile.organizationName ||
                            ""
                        }
                        InputProps={{
                            readOnly: true,
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
                        label="Department"
                        value={
                            profile.departmentName ||
                            ""
                        }
                        InputProps={{
                            readOnly: true,
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
                        label="Account Created"
                        value={formatProfileDate(
                            profile.createdAt
                        )}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={3}
            >
                <Stack spacing={0.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Last Login
                    </Typography>

                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >
                        {formatProfileDateTime(
                            profile.lastLoginAt
                        )}
                    </Typography>
                </Stack>

                <Stack spacing={0.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Last Profile Update
                    </Typography>

                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >
                        {formatProfileDateTime(
                            profile.updatedAt
                        )}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}

AccountInformationCard.propTypes = {
    profile: PropTypes.shape({
        email:
            PropTypes.string,
        role:
            PropTypes.string,
        status:
            PropTypes.string,
        organizationName:
            PropTypes.string,
        departmentName:
            PropTypes.string,
        createdAt:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.instanceOf(Date),
            ]),
        updatedAt:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.instanceOf(Date),
            ]),
        lastLoginAt:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.instanceOf(Date),
            ]),
    }).isRequired,
};
