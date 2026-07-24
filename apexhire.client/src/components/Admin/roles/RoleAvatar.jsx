import { Work } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

import {
    getRoleInitials,
    normalizeRoleName
} from "../../../utils/roleHelpers";

function getRoleIcon(roleName) {
    switch (normalizeRoleName(roleName)) {
        case "Admin":
            return <AdminPanelSettingsOutlinedIcon />;

        case "Recruiter":
            return <WorkOutlineOutlinedIcon />;

        case "HiringManager":
            return <SupervisorAccountOutlinedIcon />;

        case "Candidate":
            return <PersonOutlineOutlinedIcon />;

        default:
            return null;
    }
}

export default function RoleAvatar({
    role,
    size = 44,
    showIcon = true,
    sx
}) {
    const icon = showIcon
        ? getRoleIcon(
            role?.name ??
            role?.displayName
        )
        : null;

    return (
        <Avatar
            aria-label={
                role?.displayName ??
                role?.name ??
                "Role"
            }
            sx={{
                width: size,
                height: size,
                fontSize: size * 0.34,
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                ...sx
            }}
        >
            {icon ?? getRoleInitials(role)}
        </Avatar>
    );
}




