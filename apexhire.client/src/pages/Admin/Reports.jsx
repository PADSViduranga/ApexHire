import {
    Alert,
    Box,
    Container,
    Snackbar,
    Typography,
} from "@mui/material";

import useAdminReports from "../../hooks/useAdminReports";

import {
    EmptyReportState,
    ReportFilters,
    ReportKpiCards,
    ReportLoadingState,
    ReportOverviewCharts,
    ReportRecentActivity,
    ReportTables,
} from "../../components/Admin/reports";

export default function Reports() {
    const {
        reportData,
        filters,

        isLoading,
        isRefreshing,
        isExporting,

        error,
        exportError,

        updateFilter,
        resetFilters,

        refreshReports,
        exportReport,

        clearError,
        clearExportError,
    } = useAdminReports();

    if (isLoading) {
        return (
            <Container
                maxWidth="xl"
                sx={{ py: 4 }}
            >
                <ReportLoadingState />
            </Container>
        );
    }

    const hasData =
        reportData.summary.totalUsers > 0 ||
        reportData.summary.totalJobs > 0 ||
        reportData.summary.totalApplications > 0;

    return (
        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >
            <Box mb={4}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Reports & Analytics
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    Recruitment insights, hiring
                    analytics and platform statistics.
                </Typography>
            </Box>

            <ReportFilters
                filters={filters}
                isRefreshing={
                    isRefreshing
                }
                isExporting={
                    isExporting
                }
                onFilterChange={
                    updateFilter
                }
                onReset={
                    resetFilters
                }
                onRefresh={
                    refreshReports
                }
                onExport={
                    exportReport
                }
            />

            {!hasData ? (
                <EmptyReportState
                    onRefresh={
                        refreshReports
                    }
                />
            ) : (
                <>
                    <ReportKpiCards
                        data={
                            reportData.summary
                        }
                    />

                    <ReportOverviewCharts
                        applicationTrend={
                            reportData.applicationTrend
                        }
                        jobTrend={
                            reportData.jobTrend
                        }
                        userDistribution={
                            reportData.userDistribution
                        }
                        hiringFunnel={
                            reportData.hiringFunnel
                        }
                    />

                    <ReportTables
                        topJobs={
                            reportData.topJobs
                        }
                        topRecruiters={
                            reportData.topRecruiters
                        }
                        topOrganizations={
                            reportData.topOrganizations
                        }
                    />

                    <ReportRecentActivity
                        data={
                            reportData.recentActivities
                        }
                    />
                </>
            )}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={clearError}
            >
                <Alert
                    severity="error"
                    onClose={clearError}
                    variant="filled"
                >
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={Boolean(exportError)}
                autoHideDuration={5000}
                onClose={
                    clearExportError
                }
            >
                <Alert
                    severity="error"
                    onClose={
                        clearExportError
                    }
                    variant="filled"
                >
                    {exportError}
                </Alert>
            </Snackbar>
        </Container>
    );
}
