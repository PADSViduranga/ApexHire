import PropTypes from "prop-types";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
} from "@mui/material";

import {
    AUDIT_ACTION_OPTIONS,
    AUDIT_MODULE_OPTIONS,
    AUDIT_SEVERITY_OPTIONS,
    AUDIT_STATUS_OPTIONS,
} from "../../../utils/auditLogConstants";

export default function AuditLogToolbar({
    filters,
    isRefreshing = false,
    onFilterChange,
    onResetFilters,
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
            sx={{
                p: 2,
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack spacing={2}>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            name="search"
                            label="Search audit logs"
                            value={
                                filters.search
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="User, action, entity, description..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
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
                            select
                            fullWidth
                            size="small"
                            name="action"
                            label="Action"
                            value={
                                filters.action
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <MenuItem value="">
                                All actions
                            </MenuItem>

                            {AUDIT_ACTION_OPTIONS.map(
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
                            name="module"
                            label="Module"
                            value={
                                filters.module
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <MenuItem value="">
                                All modules
                            </MenuItem>

                            {AUDIT_MODULE_OPTIONS.map(
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
                            name="severity"
                            label="Severity"
                            value={
                                filters.severity
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <MenuItem value="">
                                All severities
                            </MenuItem>

                            {AUDIT_SEVERITY_OPTIONS.map(
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
                            name="status"
                            label="Status"
                            value={
                                filters.status
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <MenuItem value="">
                                All statuses
                            </MenuItem>

                            {AUDIT_STATUS_OPTIONS.map(
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

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            name="entityName"
                            label="Entity name"
                            value={
                                filters.entityName
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            name="entityId"
                            label="Entity ID"
                            value={
                                filters.entityId
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            name="fromDate"
                            label="From date"
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
                        md={3}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            name="toDate"
                            label="To date"
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
                </Grid>

                <Box
                    sx={{
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
                        onClick={
                            onResetFilters
                        }
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
                        disabled={
                            isRefreshing
                        }
                    >
                        Refresh
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
}

AuditLogToolbar.propTypes = {
    filters: PropTypes.shape({
        search: PropTypes.string,
        action: PropTypes.string,
        module: PropTypes.string,
        entityName: PropTypes.string,
        entityId: PropTypes.string,
        severity: PropTypes.string,
        status: PropTypes.string,
        fromDate: PropTypes.string,
        toDate: PropTypes.string,
    }).isRequired,

    isRefreshing: PropTypes.bool,

    onFilterChange:
        PropTypes.func.isRequired,

    onResetFilters:
        PropTypes.func.isRequired,

    onRefresh:
        PropTypes.func.isRequired,
};
