import PropTypes from "prop-types";

import RefreshIcon
    from "@mui/icons-material/Refresh";

import RestartAltIcon
    from "@mui/icons-material/RestartAlt";

import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ANALYTICS_GROUP_BY_OPTIONS,
    ANALYTICS_PERIOD_OPTIONS,
} from "../../../utils/adminAnalyticsConstants";

import "./AnalyticsFilters.css";

export default function AnalyticsFilters({
    filters,
    isRefreshing = false,
    onFilterChange,
    onReset,
    onRefresh,
}) {
    function handleChange(event) {
        onFilterChange(
            event.target.name,
            event.target.value
        );
    }

    return (
        <Paper
            elevation={0}
            className="hm-analytics-filters"
        >
            <Box className="hm-analytics-filters-header">
                <Box>
                    <Typography className="hm-analytics-filters-eyebrow">
                        Analytics Controls
                    </Typography>

                    <Typography className="hm-analytics-filters-title">
                        Filter performance data
                    </Typography>
                </Box>

                <Typography className="hm-analytics-filters-caption">
                    Refine the dashboard using period,
                    department, recruiter and job filters.
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
                alignItems="center"
                className="hm-analytics-filters-grid"
            >
                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="period"
                        label="Analytics Period"
                        value={filters.period}
                        onChange={handleChange}
                        className="hm-analytics-filter-field"
                    >
                        {ANALYTICS_PERIOD_OPTIONS.map(
                            option => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="groupBy"
                        label="Group By"
                        value={filters.groupBy}
                        onChange={handleChange}
                        className="hm-analytics-filter-field"
                    >
                        {ANALYTICS_GROUP_BY_OPTIONS.map(
                            option => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>

                {filters.period === "custom" && (
                    <>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                name="fromDate"
                                label="From Date"
                                value={filters.fromDate}
                                onChange={handleChange}
                                className="hm-analytics-filter-field"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                name="toDate"
                                label="To Date"
                                value={filters.toDate}
                                onChange={handleChange}
                                className="hm-analytics-filter-field"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        size="small"
                        name="organizationId"
                        label="Organization ID"
                        value={filters.organizationId}
                        onChange={handleChange}
                        className="hm-analytics-filter-field"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        size="small"
                        name="departmentId"
                        label="Department ID"
                        value={filters.departmentId}
                        onChange={handleChange}
                        className="hm-analytics-filter-field"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        size="small"
                        name="recruiterId"
                        label="Recruiter ID"
                        value={filters.recruiterId}
                        onChange={handleChange}
                        className="hm-analytics-filter-field"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        size="small"
                        name="jobId"
                        label="Job ID"
                        value={filters.jobId}
                        onChange={handleChange}
                        className="hm-analytics-filter-field"
                    />
                </Grid>
            </Grid>

            <Box className="hm-analytics-filter-actions">
                <Button
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={onReset}
                    className="hm-analytics-reset-button"
                >
                    Reset
                </Button>

                <Button
                    variant="contained"
                    startIcon={
                        isRefreshing ? (
                            <CircularProgress
                                size={16}
                                color="inherit"
                            />
                        ) : (
                            <RefreshIcon />
                        )
                    }
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="hm-analytics-refresh-button"
                >
                    Refresh
                </Button>
            </Box>
        </Paper>
    );
}

AnalyticsFilters.propTypes = {
    filters: PropTypes.shape({
        period: PropTypes.string.isRequired,
        fromDate: PropTypes.string.isRequired,
        toDate: PropTypes.string.isRequired,
        groupBy: PropTypes.string.isRequired,

        organizationId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

        departmentId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

        recruiterId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

        jobId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }).isRequired,

    isRefreshing: PropTypes.bool,
    onFilterChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
};
