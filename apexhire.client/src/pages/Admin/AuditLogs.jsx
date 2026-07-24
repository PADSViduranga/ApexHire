import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import useAuditLogs from "../../hooks/useAuditLogs";

import {
    AuditLogDetailsDialog,
    AuditLogStatsCards,
    AuditLogTable,
    AuditLogToolbar,
    EmptyAuditLogs,
} from "../../components/Admin/auditLogs";

export default function AuditLogs() {
    const {
        auditLogs,

        pagination,
        sorting,

        filters,

        selectedAuditLog,

        isLoading,
        isRefreshing,
        isDetailsLoading,

        error,
        detailsError,

        updateFilter,
        resetFilters,

        changePage,
        changePageSize,
        changeSorting,

        openAuditLogDetails,
        closeAuditLogDetails,

        refresh,
    } = useAuditLogs();

    const hasFilters =
        Boolean(filters.search) ||
        Boolean(filters.action) ||
        Boolean(filters.module) ||
        Boolean(filters.entityName) ||
        Boolean(filters.entityId) ||
        Boolean(filters.severity) ||
        Boolean(filters.status) ||
        Boolean(filters.fromDate) ||
        Boolean(filters.toDate);

    return (
        <Container
            maxWidth={false}
            sx={{
                py: 4,
            }}
        >
            <Box mb={3}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Audit Logs
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Monitor administrator activity and
                    system events.
                </Typography>
            </Box>

            <AuditLogStatsCards
                auditLogs={auditLogs}
            />

            <AuditLogToolbar
                filters={filters}
                isRefreshing={
                    isRefreshing
                }
                onFilterChange={
                    updateFilter
                }
                onResetFilters={
                    resetFilters
                }
                onRefresh={refresh}
            />

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <AuditLogTable
                    auditLogs={[]}
                    pagination={
                        pagination
                    }
                    sorting={sorting}
                    isLoading
                    onPageChange={
                        changePage
                    }
                    onPageSizeChange={
                        changePageSize
                    }
                    onSortChange={
                        changeSorting
                    }
                    onViewDetails={
                        openAuditLogDetails
                    }
                />
            ) : auditLogs.length === 0 ? (
                <EmptyAuditLogs
                    hasFilters={
                        hasFilters
                    }
                    onResetFilters={
                        resetFilters
                    }
                />
            ) : (
                <AuditLogTable
                    auditLogs={
                        auditLogs
                    }
                    pagination={
                        pagination
                    }
                    sorting={sorting}
                    isLoading={false}
                    onPageChange={
                        changePage
                    }
                    onPageSizeChange={
                        changePageSize
                    }
                    onSortChange={
                        changeSorting
                    }
                    onViewDetails={
                        openAuditLogDetails
                    }
                />
            )}

            <AuditLogDetailsDialog
                open={
                    Boolean(
                        selectedAuditLog
                    )
                }
                auditLog={
                    selectedAuditLog
                }
                isLoading={
                    isDetailsLoading
                }
                error={
                    detailsError
                }
                onClose={
                    closeAuditLogDetails
                }
            />

            {(isLoading ||
                isRefreshing) && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
}
