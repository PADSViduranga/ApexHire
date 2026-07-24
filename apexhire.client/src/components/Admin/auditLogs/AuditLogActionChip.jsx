import PropTypes from "prop-types";

import {
    Chip,
    Tooltip,
} from "@mui/material";

import {
    getActionColor,
} from "../../../utils/auditLogHelpers";

import "./AuditLogActionChip.css";

export default function AuditLogActionChip({
    action,
    size = "small",
}) {
    const label =
        action?.trim() || "Unknown";

    const actionKey = label
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
        <Tooltip
            title={`Audit action: ${label}`}
            arrow
            placement="top"
            classes={{
                popper:
                    "condo-audit-action-tooltip-popper",
            }}
        >
            <Chip
                label={label}
                color={getActionColor(label)}
                size={size}
                variant="outlined"
                className={`
                    condo-audit-action-chip
                    condo-audit-action-chip--${actionKey}
                `}
            />
        </Tooltip>
    );
}

AuditLogActionChip.propTypes = {
    action: PropTypes.string,
    size: PropTypes.oneOf([
        "small",
        "medium",
    ]),
};
