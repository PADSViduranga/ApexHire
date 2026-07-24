import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    LinearProgress,
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
    formatNumber,
    formatPercentage,
} from "../../../utils/adminReportHelpers";

export default function TopRecruitersTable({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                height: "100%",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: 2.5,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Top Recruiters
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Recruiters with the highest hiring performance.
                </Typography>
            </Box>

            {isLoading ? (
                <Box p={2.5}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            height={44}
                            sx={{ mb: 1 }}
                        />
                    ))}
                </Box>
            ) : data.length === 0 ? (
                <Box
                    sx={{
                        minHeight: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No recruiter data available.
                    </Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Recruiter
                                </TableCell>

                                <TableCell align="right">
                                    Jobs
                                </TableCell>

                                <TableCell align="right">
                                    Reviewed
                                </TableCell>

                                <TableCell align="right">
                                    Hires
                                </TableCell>

                                <TableCell>
                                    Success Rate
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.map((recruiter, index) => (
                                <TableRow
                                    hover
                                    key={
                                        recruiter.id ??
                                        `${recruiter.name}-${index}`
                                    }
                                >
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Avatar>
                                                {recruiter.name?.charAt(0) ?? "R"}
                                            </Avatar>

                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                >
                                                    {recruiter.name}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {recruiter.email || "—"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.jobsPosted
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.applicationsReviewed
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            recruiter.hires
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ minWidth: 140 }}>
                                        <Typography
                                            variant="caption"
                                        >
                                            {formatPercentage(
                                                recruiter.successRate
                                            )}
                                        </Typography>

                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(
                                                recruiter.successRate || 0,
                                                100
                                            )}
                                            sx={{
                                                mt: 0.5,
                                                height: 6,
                                                borderRadius: 999,
                                            }}
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

TopRecruitersTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            name: PropTypes.string.isRequired,
            email: PropTypes.string,
            jobsPosted: PropTypes.number,
            applicationsReviewed: PropTypes.number,
            hires: PropTypes.number,
            successRate: PropTypes.number,
        })
    ),
    isLoading: PropTypes.bool,
};
