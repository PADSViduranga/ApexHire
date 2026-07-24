import Chip from "@mui/material/Chip";

import {
    formatRoleName,
    getRoleColor
} from "../../../utils/roleHelpers";

export default function RoleStatusChip({
    role,
    size = "small",
    variant = "filled",
    sx
}) {
    return (
        <Chip
            label={
                role
                    ? formatRoleName(role)
                    : "Unknown"
            }
            color={
                role
                    ? getRoleColor(role)
                    : "default"
            }
            size={size}
            variant={variant}
            sx={{
                minWidth: 130,
                fontWeight: 600,
                ...sx
            }}
        />
    );
}
