import PropTypes from "prop-types";

import {
    Box,
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

export default function RecruiterPerformanceTable({
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
                        Team productivity
                    </Typography>

                    <Typography
                        variant="h6"
                        className="condo-analytics-card-title"
                    >
                        Recruiter Performance
                    </Typography>

                    <Typography className="condo-analytics-card-description">
                        Review recruiter activity, hiring results, and efficiency.
                    </Typography>
                </div>

                <div className="condo-table-count">
                    {formatNumber(rows.length)}
                    <span>recruiters</span>
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
                        No recruiter data
                    </Typography>

                    <Typography className="condo-empty-text">
                        Recruiter performance details will appear here.
                    </Typography>
                </Box>
            ) : (
                <TableContainer className="condo-analytics-table-container">
                    <Table
                        size="small"
                        aria-label="Recruiter performance table"
                        className="condo-analytics-table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Recruiter</TableCell>
                                <TableCell align="right">Jobs</TableCell>
                                <TableCell align="right">Reviewed</TableCell>
                                <TableCell align="right">Interviews</TableCell>
                                <TableCell align="right">Offers</TableCell>
                                <TableCell align="right">Hires</TableCell>
                                <TableCell align="right">Conversion</TableCell>
                                <TableCell align="right">Time to Hire</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((recruiter, index) => (
                                <TableRow
                                    key={
                                        recruiter.id ??
                                        recruiter.email ??
                                        `${recruiter.name}-${index}`
                                    }
                                    className="condo-analytics-table-row"
                                >
                                    <TableCell>
                                        <div className="condo-table-primary-cell">
                                            <div className="condo-table-avatar condo-recruiter-avatar">
                                                {recruiter.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "R"}
                                            </div>

                                            <div>
                                                <Typography className="condo-table-primary-text">
                                                    {recruiter.name}
                                                </Typography>

                                                {recruiter.email && (
                                                    <Typography className="condo-table-secondary-text">
                                                        {recruiter.email}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.jobsManaged
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.applicationsReviewed
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.interviewsScheduled
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.offersMade
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        <strong className="condo-highlight-number">
                                            {formatNumber(
                                                recruiter.hires
                                            )}
                                        </strong>
                                    </TableCell>

                                    <TableCell align="right">
                                        <span className="condo-percentage-value">
                                            {formatPercentage(
                                                recruiter.conversionRate
                                            )}
                                        </span>
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatDays(
                                            recruiter.averageTimeToHireDays
                                        )}
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

RecruiterPerformanceTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            name: PropTypes.string,
            email: PropTypes.string,
            jobsManaged: PropTypes.number,
            applicationsReviewed: PropTypes.number,
            interviewsScheduled: PropTypes.number,
            offersMade: PropTypes.number,
            hires: PropTypes.number,
            conversionRate: PropTypes.number,
            averageTimeToHireDays: PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
