import PropTypes from "prop-types";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    TextField,
} from "@mui/material";

import {
    APPLICATION_STATUS_OPTIONS,
    REPORT_EXPORT_FORMATS,
    REPORT_PERIOD_OPTIONS,
} from "../../../utils/adminReportConstants";

export default function ReportFilters({
    filters,
    isRefreshing = false,
    isExporting = false,
    onFilterChange,
    onReset,
    onRefresh,
    onExport,
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
            sx={{
                p: 2,
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Grid
                container
                spacing={2}
                alignItems="center"
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="period"
                        label="Report Period"
                        value={filters.period}
                        onChange={handleChange}
                    >
                        {REPORT_PERIOD_OPTIONS.map(
                            option => (
                                <MenuItem
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>

                {filters.period ===
                    "custom" && (
                    <>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                name="fromDate"
                                label="From Date"
                                value={
                                    filters.fromDate
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                name="toDate"
                                label="To Date"
                                value={
                                    filters.toDate
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </>
                )}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >
                    <TextField
                        fullWidth
                        size="small"
                        name="organizationId"
                        label="Organization ID"
                        value={
                            filters.organizationId
                        }
                        onChange={handleChange}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >
                    <TextField
                        fullWidth
                        size="small"
                        name="departmentId"
                        label="Department ID"
                        value={
                            filters.departmentId
                        }
                        onChange={handleChange}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >
                    <TextField
                        fullWidth
                        size="small"
                        name="recruiterId"
                        label="Recruiter ID"
                        value={
                            filters.recruiterId
                        }
                        onChange={handleChange}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >
                    <TextField
                        fullWidth
                        size="small"
                        name="jobId"
                        label="Job ID"
                        value={
                            filters.jobId
                        }
                        onChange={handleChange}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="applicationStatus"
                        label="Application Status"
                        value={
                            filters.applicationStatus
                        }
                        onChange={handleChange}
                    >
                        {APPLICATION_STATUS_OPTIONS.map(
                            option => (
                                <MenuItem
                                    key={
                                        option.value ||
                                        "all"
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>
            </Grid>

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent:
                        "flex-end",
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={
                        <RestartAltIcon />
                    }
                    onClick={onReset}
                >
                    Reset
                </Button>

                <Button
                    variant="outlined"
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
                    disabled={
                        isRefreshing
                    }
                >
                    Refresh
                </Button>

                {REPORT_EXPORT_FORMATS.map(
                    format => (
                        <Button
                            key={
                                format.value
                            }
                            variant="contained"
                            startIcon={
                                isExporting ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : (
                                    <DownloadOutlinedIcon />
                                )
                            }
                            onClick={() =>
                                onExport(
                                    format.value
                                )
                            }
                            disabled={
                                isExporting
                            }
                        >
                            Export{" "}
                            {format.label}
                        </Button>
                    )
                )}
            </Box>
        </Paper>
    );
}

ReportFilters.propTypes = {
    filters: PropTypes.shape({
        period:
            PropTypes.string.isRequired,
        fromDate:
            PropTypes.string.isRequired,
        toDate:
            PropTypes.string.isRequired,
        organizationId:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        departmentId:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        recruiterId:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        jobId:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        applicationStatus:
            PropTypes.string,
    }).isRequired,

    isRefreshing:
        PropTypes.bool,

    isExporting:
        PropTypes.bool,

    onFilterChange:
        PropTypes.func.isRequired,

    onReset:
        PropTypes.func.isRequired,

    onRefresh:
        PropTypes.func.isRequired,

    onExport:
        PropTypes.func.isRequired,
};
