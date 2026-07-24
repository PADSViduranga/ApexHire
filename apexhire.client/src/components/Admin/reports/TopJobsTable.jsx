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
    formatNumber,
} from "../../../utils/adminReportHelpers";

export default function TopJobsTable({
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
                    Top Performing Jobs
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Jobs ranked by application
                    activity and successful hires.
                </Typography>
            </Box>

            {isLoading ? (
                <Box p={2.5}>
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            height={44}
                            sx={{
                                mb: 1,
                            }}
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
                        No job performance data
                        available.
                    </Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table
                        size="small"
                        aria-label="Top performing jobs"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Job
                                </TableCell>

                                <TableCell>
                                    Organization
                                </TableCell>

                                <TableCell
                                    align="right"
                                >
                                    Applications
                                </TableCell>

                                <TableCell
                                    align="right"
                                >
                                    Shortlisted
                                </TableCell>

                                <TableCell
                                    align="right"
                                >
                                    Hires
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.map(
                                (
                                    job,
                                    index
                                ) => (
                                    <TableRow
                                        key={
                                            job.id ??
                                            `${job.title}-${index}`
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={
                                                    600
                                                }
                                            >
                                                {
                                                    job.title
                                                }
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {
                                                    job.department
                                                }
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {
                                                job.organization
                                            }
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >
                                            {formatNumber(
                                                job.applications
                                            )}
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >
                                            {formatNumber(
                                                job.shortlisted
                                            )}
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >
                                            {formatNumber(
                                                job.hires
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={
                                                    job.status
                                                }
                                                variant="outlined"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}

TopJobsTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),

            title:
                PropTypes.string.isRequired,

            organization:
                PropTypes.string,

            department:
                PropTypes.string,

            applications:
                PropTypes.number,

            shortlisted:
                PropTypes.number,

            hires:
                PropTypes.number,

            status:
                PropTypes.string,
        })
    ),

    isLoading:
        PropTypes.bool,
};
