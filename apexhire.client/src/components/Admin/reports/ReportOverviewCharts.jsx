import PropTypes from "prop-types";
import {
    Grid,
} from "@mui/material";

import ApplicationsTrendChart from "./ApplicationsTrendChart";
import HiringFunnelChart from "./HiringFunnelChart";
import JobsTrendChart from "./JobsTrendChart";
import UserDistributionChart from "./UserDistributionChart";

export default function ReportOverviewCharts({
    applicationTrend = [],
    jobTrend = [],
    userDistribution = [],
    hiringFunnel = [],
    isLoading = false,
}) {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                mb: 3,
            }}
        >
            <Grid
                item
                xs={12}
                lg={8}
            >
                <ApplicationsTrendChart
                    data={applicationTrend}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                item
                xs={12}
                lg={4}
            >
                <UserDistributionChart
                    data={userDistribution}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                item
                xs={12}
                lg={6}
            >
                <JobsTrendChart
                    data={jobTrend}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                item
                xs={12}
                lg={6}
            >
                <HiringFunnelChart
                    data={hiringFunnel}
                    isLoading={isLoading}
                />
            </Grid>
        </Grid>
    );
}

ReportOverviewCharts.propTypes = {
    applicationTrend:
        PropTypes.array,

    jobTrend:
        PropTypes.array,

    userDistribution:
        PropTypes.array,

    hiringFunnel:
        PropTypes.array,

    isLoading:
        PropTypes.bool,
};
