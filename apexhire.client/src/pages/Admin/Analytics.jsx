import {
    Alert,
    Box,
    Grid,
    Typography,
} from "@mui/material";

import useAdminAnalytics from "../../hooks/useAdminAnalytics";

import {
    AnalyticsFilters,
    AnalyticsInsights,
    AnalyticsKpiCards,
    AnalyticsLoadingState,
    ApplicationPerformanceChart,
    ConversionRateChart,
    DepartmentPerformanceChart,
    EmptyAnalyticsState,
    HiringVelocityChart,
    JobPerformanceTable,
    RecruiterPerformanceTable,
    SourcePerformanceChart,
} from "../../components/Admin/analytics";

import "../../styles/adminAnalytics.css";

export default function Analytics() {
    const {
        analyticsData,
        filters,

        isLoading,
        isRefreshing,
        error,

        updateFilter,
        resetFilters,
        refreshAnalytics,
    } = useAdminAnalytics();

    if (isLoading) {
        return (
            <AnalyticsLoadingState />
        );
    }

    const hasData =
        analyticsData.summary.totalApplications > 0 ||
        analyticsData.applicationPerformance.length > 0 ||
        analyticsData.jobPerformance.length > 0;

    return (
        <Box className="hm-analytics-page">
            <Typography
                variant="h4"
                className="hm-analytics-title"
                mb={3}
            >
                Analytics
            </Typography>

            <AnalyticsFilters
                filters={filters}
                isRefreshing={isRefreshing}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                onRefresh={refreshAnalytics}
            />

            {error && (
                <Alert
                    severity="error"
                    className="hm-analytics-alert"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {!hasData ? (
                <EmptyAnalyticsState
                    onReset={resetFilters}
                />
            ) : (
                <>
                    <AnalyticsKpiCards
                        data={analyticsData.summary}
                        isLoading={isRefreshing}
                    />

                    <Grid
                        container
                        spacing={3}
                        className="hm-analytics-grid"
                    >
                        <Grid item xs={12} lg={6}>
                            <ApplicationPerformanceChart
                                data={analyticsData.applicationPerformance}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <HiringVelocityChart
                                data={analyticsData.hiringVelocity}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <ConversionRateChart
                                data={analyticsData.conversionRates}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <SourcePerformanceChart
                                data={analyticsData.sourcePerformance}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DepartmentPerformanceChart
                                data={analyticsData.departmentPerformance}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <RecruiterPerformanceTable
                                data={analyticsData.recruiterPerformance}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <JobPerformanceTable
                                data={analyticsData.jobPerformance}
                                isLoading={isRefreshing}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <AnalyticsInsights
                                data={analyticsData.insights}
                                isLoading={isRefreshing}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}
