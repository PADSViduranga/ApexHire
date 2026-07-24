import PropTypes from "prop-types";

import {
    Box,
    Chip,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import {
    ANALYTICS_MAX_TABLE_ROWS,
} from "../../../utils/adminAnalyticsConstants";

import {
    formatDays,
    formatNumber,
    formatPercentage,
} from "../../../utils/adminAnalyticsHelpers";

import "./AdminAnalyticsVisuals.css";

function getStatusClass(status) {
    const normalizedStatus =
        String(status || "")
            .trim()
            .toLowerCase();

    switch (normalizedStatus) {
        case "active":
        case "open":
        case "published":
            return "condo-status-success";

        case "draft":
        case "pending":
            return "condo-status-warning";

        case "cancelled":
        case "canceled":
            return "condo-status-error";

        case "closed":
        case "filled":
            return "condo-status-neutral";

        default:
            return "condo-status-neutral";
    }
}

export default function JobPerformanceTable({
    data = [],
    isLoading = false,
}) {
    const rows = data.slice(
        0,
        ANALYTICS_MAX_TABLE_ROWS
    );

    return (
        <Paper
            elevation={0}
            className="condo-analytics-card condo-analytics-table-card"
        >
            <div className="condo-card-glow" />

            <Box className="condo-analytics-card-header">
                <div>
                    <Typography className="condo-analytics-card-eyebrow">
                        Vacancy insights
                    </Typography>

                    <Typography
                        variant="h6"
                        className="condo-analytics-card-title"
                    >
                        Job Performance
                    </Typography>

                    <Typography className="condo-analytics-card-description">
                        Compare application volume, hiring outcomes, and job efficiency.
                    </Typography>
                </div>

                <div className="condo-table-count">
                    {formatNumber(rows.length)}
                    <span>jobs</span>
                </div>
            </Box>

            {isLoading ? (
                <Box className="condo-table-loading">
                    <Skeleton
                        variant="rounded"
                        height={320}
                        className="condo-analytics-skeleton"
                    />
                </Box>
            ) : rows.length === 0 ? (
                <Box className="condo-analytics-empty-state condo-table-empty">
                    <div className="condo-empty-icon">
                        <span />
                        <span />
                        <span />
                    </div>

                    <Typography className="condo-empty-title">
                        No job data
                    </Typography>

                    <Typography className="condo-empty-text">
                        Job performance details will appear here.
                    </Typography>
                </Box>
            ) : (
                <TableContainer className="condo-analytics-table-container">
                    <Table
                        size="small"
                        aria-label="Job performance table"
                        className="condo-analytics-table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Job</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell align="right">Applications</TableCell>
                                <TableCell align="right">Interviews</TableCell>
                                <TableCell align="right">Offers</TableCell>
                                <TableCell align="right">Hires</TableCell>
                                <TableCell align="right">Conversion</TableCell>
                                <TableCell align="right">Time to Hire</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((job, index) => (
                                <TableRow
                                    key={
                                        job.id ??
                                        `${job.title}-${index}`
                                    }
                                    className="condo-analytics-table-row"
                                >
                                    <TableCell>
                                        <div className="condo-table-primary-cell">
                                            <div className="condo-table-avatar">
                                                {job.title
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "J"}
                                            </div>

                                            <div>
                                                <Typography className="condo-table-primary-text">
                                                    {job.title}
                                                </Typography>

                                                <Typography className="condo-table-secondary-text">
                                                    {job.organization}
                                                </Typography>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="condo-department-pill">
                                            {job.department || "Unassigned"}
                                        </span>
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(job.applications)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(job.interviews)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(job.offers)}
                                    </TableCell>

                                    <TableCell align="right">
                                        <strong className="condo-highlight-number">
                                            {formatNumber(job.hires)}
                                        </strong>
                                    </TableCell>

                                    <TableCell align="right">
                                        <span className="condo-percentage-value">
                                            {formatPercentage(
                                                job.conversionRate
                                            )}
                                        </span>
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatDays(
                                            job.averageTimeToHireDays
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Chip
                                            size="small"
                                            label={job.status || "Unknown"}
                                            className={`condo-status-chip ${getStatusClass(
                                                job.status
                                            )}`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}

JobPerformanceTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            title: PropTypes.string,
            organization: PropTypes.string,
            department: PropTypes.string,
            applications: PropTypes.number,
            interviews: PropTypes.number,
            offers: PropTypes.number,
            hires: PropTypes.number,
            conversionRate: PropTypes.number,
            averageTimeToHireDays: PropTypes.number,
            status: PropTypes.string,
        })
    ),

    isLoading: PropTypes.bool,
};
