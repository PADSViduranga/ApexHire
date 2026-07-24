import PropTypes from "prop-types";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Chip,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
} from "@mui/material";

import AuditLogActionChip from "./AuditLogActionChip";
import AuditLogAvatar from "./AuditLogAvatar";
import {
    getHttpStatusColor,
    getSeverityColor,
    getStatusColor,
} from "../../../utils/auditLogHelpers";

const COLUMNS = [
    {
        id: "createdAt",
        label: "Date & Time",
        sortable: true,
    },
    {
        id: "userName",
        label: "User",
        sortable: true,
    },
    {
        id: "action",
        label: "Action",
        sortable: true,
    },
    {
        id: "module",
        label: "Module",
        sortable: true,
    },
    {
        id: "entityName",
        label: "Entity",
        sortable: true,
    },
    {
        id: "severity",
        label: "Severity",
        sortable: true,
    },
    {
        id: "status",
        label: "Status",
        sortable: true,
    },
    {
        id: "responseStatusCode",
        label: "HTTP",
        sortable: false,
    },
    {
        id: "actions",
        label: "",
        sortable: false,
        align: "right",
    },
];

function LoadingRows({
    count = 8,
}) {
    return Array.from({
        length: count,
    }).map((_, index) => (
        <TableRow key={index}>
            {COLUMNS.map(column => (
                <TableCell
                    key={column.id}
                    align={
                        column.align || "left"
                    }
                >
                    <Skeleton
                        variant="text"
                        width={
                            column.id ===
                            "actions"
                                ? 32
                                : "80%"
                        }
                    />
                </TableCell>
            ))}
        </TableRow>
    ));
}

LoadingRows.propTypes = {
    count: PropTypes.number,
};

export default function AuditLogTable({
    auditLogs = [],
    pagination,
    sorting,
    isLoading = false,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onViewDetails,
}) {
    function handlePageChange(
        _event,
        page
    ) {
        onPageChange(page + 1);
    }

    function handleRowsPerPageChange(
        event
    ) {
        onPageSizeChange(
            Number(event.target.value)
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        minWidth: 1250,
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {COLUMNS.map(
                                column => (
                                    <TableCell
                                        key={
                                            column.id
                                        }
                                        align={
                                            column.align ||
                                            "left"
                                        }
                                        sortDirection={
                                            sorting.sortBy ===
                                            column.id
                                                ? sorting.sortDirection
                                                : false
                                        }
                                        sx={{
                                            fontWeight: 700,
                                            whiteSpace:
                                                "nowrap",
                                            bgcolor:
                                                "background.default",
                                        }}
                                    >
                                        {column.sortable ? (
                                            <TableSortLabel
                                                active={
                                                    sorting.sortBy ===
                                                    column.id
                                                }
                                                direction={
                                                    sorting.sortBy ===
                                                    column.id
                                                        ? sorting.sortDirection
                                                        : "asc"
                                                }
                                                onClick={() =>
                                                    onSortChange(
                                                        column.id
                                                    )
                                                }
                                            >
                                                {
                                                    column.label
                                                }
                                            </TableSortLabel>
                                        ) : (
                                            column.label
                                        )}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <LoadingRows />
                        ) : (
                            auditLogs.map(
                                auditLog => (
                                    <TableRow
                                        key={
                                            auditLog.id
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            <Tooltip
                                                title={
                                                    auditLog.formattedCreatedAt
                                                }
                                                arrow
                                            >
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={
                                                            600
                                                        }
                                                        noWrap
                                                    >
                                                        {
                                                            auditLog.relativeCreatedAt
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        noWrap
                                                    >
                                                        {
                                                            auditLog.formattedCreatedAt
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>
                                            <AuditLogAvatar
                                                userName={
                                                    auditLog.userName
                                                }
                                                email={
                                                    auditLog.email
                                                }
                                                initials={
                                                    auditLog.userInitials
                                                }
                                                size={34}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <AuditLogActionChip
                                                action={
                                                    auditLog.action
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={
                                                    600
                                                }
                                                noWrap
                                            >
                                                {
                                                    auditLog.module
                                                }
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={
                                                        600
                                                    }
                                                    noWrap
                                                >
                                                    {
                                                        auditLog.entityName
                                                    }
                                                </Typography>

                                                {auditLog.entityId && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        noWrap
                                                    >
                                                        ID:{" "}
                                                        {
                                                            auditLog.entityId
                                                        }
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    auditLog.severity
                                                }
                                                size="small"
                                                color={getSeverityColor(
                                                    auditLog.severity
                                                )}
                                                variant="outlined"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    auditLog.status
                                                }
                                                size="small"
                                                color={getStatusColor(
                                                    auditLog.status
                                                )}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    auditLog.responseStatusCode ??
                                                    "—"
                                                }
                                                size="small"
                                                color={getHttpStatusColor(
                                                    auditLog.responseStatusCode
                                                )}
                                                variant="outlined"
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip
                                                title="View details"
                                                arrow
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        onViewDetails(
                                                            auditLog
                                                        )
                                                    }
                                                    aria-label={`View audit log ${auditLog.id}`}
                                                >
                                                    <VisibilityOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={
                    pagination.totalCount
                }
                page={Math.max(
                    pagination.pageNumber -
                        1,
                    0
                )}
                rowsPerPage={
                    pagination.pageSize
                }
                rowsPerPageOptions={[
                    10,
                    20,
                    50,
                    100,
                ]}
                onPageChange={
                    handlePageChange
                }
                onRowsPerPageChange={
                    handleRowsPerPageChange
                }
                showFirstButton
                showLastButton
            />
        </Paper>
    );
}

AuditLogTable.propTypes = {
    auditLogs: PropTypes.array,

    pagination: PropTypes.shape({
        pageNumber:
            PropTypes.number.isRequired,
        pageSize:
            PropTypes.number.isRequired,
        totalCount:
            PropTypes.number.isRequired,
    }).isRequired,

    sorting: PropTypes.shape({
        sortBy:
            PropTypes.string.isRequired,
        sortDirection:
            PropTypes.oneOf([
                "asc",
                "desc",
            ]).isRequired,
    }).isRequired,

    isLoading: PropTypes.bool,

    onPageChange:
        PropTypes.func.isRequired,

    onPageSizeChange:
        PropTypes.func.isRequired,

    onSortChange:
        PropTypes.func.isRequired,

    onViewDetails:
        PropTypes.func.isRequired,
};
