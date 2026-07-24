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
    formatNumber,
} from "../../../utils/adminReportHelpers";

export default function TopOrganizationsTable({
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
                    Top Organizations
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Organizations ranked by recruitment activity.
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
                        No organization data available.
                    </Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table
                        size="small"
                        aria-label="Top organizations"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Organization
                                </TableCell>

                                <TableCell align="right">
                                    Active Jobs
                                </TableCell>

                                <TableCell align="right">
                                    Total Jobs
                                </TableCell>

                                <TableCell align="right">
                                    Applications
                                </TableCell>

                                <TableCell align="right">
                                    Hires
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.map((organization, index) => (
                                <TableRow
                                    hover
                                    key={
                                        organization.id ??
                                        `${organization.name}-${index}`
                                    }
                                >
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {organization.name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            organization.activeJobs
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            organization.totalJobs
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            organization.applications
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            organization.hires
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

TopOrganizationsTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),

            name:
                PropTypes.string.isRequired,

            activeJobs:
                PropTypes.number,

            totalJobs:
                PropTypes.number,

            applications:
                PropTypes.number,

            hires:
                PropTypes.number,
        })
    ),

    isLoading:
        PropTypes.bool,
};
