import PropTypes from "prop-types";

import {
    Avatar,
    Box,
    Tooltip,
    Typography,
} from "@mui/material";

import "./AuditLogAvatar.css";

export default function AuditLogAvatar({
    userName,
    email,
    initials,
    size = 40,
    showDetails = true,
}) {
    const displayName =
        userName?.trim() ||
        email?.trim() ||
        "System";

    const displayEmail =
        email?.trim() ||
        "System activity";

    const avatarText =
        initials?.trim() ||
        "SY";

    const isSystemUser =
        displayName.toLowerCase() ===
            "system" ||
        displayEmail.toLowerCase() ===
            "system activity";

    const avatar = (
        <Avatar
            aria-label={`${displayName} avatar`}
            className={`
                condo-audit-avatar
                ${
                    isSystemUser
                        ? "condo-audit-avatar--system"
                        : ""
                }
            `}
            style={{
                "--audit-avatar-size":
                    `${size}px`,
                "--audit-avatar-font-size":
                    size <= 32
                        ? "0.72rem"
                        : size >= 52
                            ? "1rem"
                            : "0.86rem",
            }}
        >
            <span className="condo-audit-avatar__initials">
                {avatarText}
            </span>
        </Avatar>
    );

    if (!showDetails) {
        return (
            <Tooltip
                title={displayName}
                arrow
                placement="top"
                classes={{
                    popper:
                        "condo-audit-avatar-tooltip-popper",
                }}
            >
                <Box
                    component="span"
                    className="condo-audit-avatar__standalone"
                >
                    {avatar}
                </Box>
            </Tooltip>
        );
    }

    return (
        <Box className="condo-audit-user">
            <Tooltip
                title={displayName}
                arrow
                placement="top"
                classes={{
                    popper:
                        "condo-audit-avatar-tooltip-popper",
                }}
            >
                <Box
                    component="span"
                    className="condo-audit-avatar__wrapper"
                >
                    {avatar}
                </Box>
            </Tooltip>

            <Box className="condo-audit-user__details">
                <Typography
                    variant="body2"
                    noWrap
                    title={displayName}
                    className="condo-audit-user__name"
                >
                    {displayName}
                </Typography>

                <Typography
                    variant="caption"
                    noWrap
                    title={displayEmail}
                    className="condo-audit-user__email"
                >
                    {displayEmail}
                </Typography>
            </Box>
        </Box>
    );
}

AuditLogAvatar.propTypes = {
    userName: PropTypes.string,
    email: PropTypes.string,
    initials: PropTypes.string,
    size: PropTypes.number,
    showDetails: PropTypes.bool,
};
