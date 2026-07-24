import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    getInitials,
} from "../../../utils/adminProfileHelpers";

function getStatusColor(status) {
    switch (
        String(status || "")
            .trim()
            .toLowerCase()
    ) {
        case "active":
            return "success";

        case "locked":
        case "suspended":
            return "error";

        case "inactive":
            return "warning";

        default:
            return "default";
    }
}

export default function AdminProfileHeader({
    profile,
}) {
    const initials =
        getInitials(
            profile.firstName,
            profile.lastName
        );

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2.5}
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
            >
                <Avatar
                    src={
                        profile.profileImageUrl ||
                        undefined
                    }
                    alt={
                        profile.fullName ||
                        "Admin profile"
                    }
                    sx={{
                        width: 88,
                        height: 88,
                        fontSize: 28,
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </Avatar>

                <Box
                    sx={{
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        noWrap
                    >
                        {profile.fullName ||
                            "Administrator"}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        noWrap
                    >
                        {profile.email ||
                            "No email available"}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mt: 1.5 }}
                    >
                        {profile.role && (
                            <Chip
                                size="small"
                                label={profile.role}
                                color="primary"
                                variant="outlined"
                            />
                        )}

                        {profile.status && (
                            <Chip
                                size="small"
                                label={profile.status}
                                color={getStatusColor(
                                    profile.status
                                )}
                            />
                        )}

                        {profile.organizationName && (
                            <Chip
                                size="small"
                                label={
                                    profile.organizationName
                                }
                                variant="outlined"
                            />
                        )}

                        {profile.departmentName && (
                            <Chip
                                size="small"
                                label={
                                    profile.departmentName
                                }
                                variant="outlined"
                            />
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
}

AdminProfileHeader.propTypes = {
    profile: PropTypes.shape({
        firstName:
            PropTypes.string,
        lastName:
            PropTypes.string,
        fullName:
            PropTypes.string,
        email:
            PropTypes.string,
        profileImageUrl:
            PropTypes.string,
        role:
            PropTypes.string,
        status:
            PropTypes.string,
        organizationName:
            PropTypes.string,
        departmentName:
            PropTypes.string,
    }).isRequired,
};
