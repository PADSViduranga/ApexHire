import PropTypes from "prop-types";

import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import "./AuditLogs.css";

export default function EmptyAuditLogs({
    hasFilters = false,
    onResetFilters,
}) {
    return (
        <Paper
            elevation={0}
            className="condo-empty-audit-card"
        >
            <div className="condo-empty-glow" />

            <Box className="condo-empty-content">
                <Box className="condo-empty-icon-wrapper">
                    <div className="condo-empty-icon-ring" />

                    <div className="condo-empty-icon">
                        <SearchOffOutlinedIcon />
                    </div>
                </Box>

                <Typography
                    variant="overline"
                    className="condo-empty-label"
                >
                    Audit Center
                </Typography>

                <Typography
                    variant="h5"
                    className="condo-empty-title"
                >
                    No Audit Logs Found
                </Typography>

                <Typography
                    className="condo-empty-description"
                >
                    {hasFilters
                        ? "No audit records matched your selected filters. Try broadening your search or reset the current filters."
                        : "Administrative activity will automatically appear here once users perform actions across the system."}
                </Typography>

                {hasFilters && (
                    <Button
                        variant="contained"
                        className="condo-reset-button"
                        onClick={onResetFilters}
                    >
                        Reset Filters
                    </Button>
                )}
            </Box>
        </Paper>
    );
}

EmptyAuditLogs.propTypes = {
    hasFilters: PropTypes.bool,
    onResetFilters: PropTypes.func,
};
