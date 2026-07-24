import PropTypes from "prop-types";

import {
    Card,
    CardContent,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import {
    formatDays,
    formatNumber,
    formatPercentage,
} from "../../../utils/adminAnalyticsHelpers";

import "./AnalyticsKpiCards.css";

function AnalyticsKpiCard({
    title,
    value,
    subtitle,
    isLoading = false,
    index,
}) {
    return (
        <Card
            elevation={0}
            className="hm-analytics-kpi-card"
            style={{
                "--hm-kpi-index": index,
            }}
        >
            <CardContent className="hm-analytics-kpi-content">
                <span className="hm-analytics-kpi-number">
                    {String(
                        index + 1
                    ).padStart(2, "0")}
                </span>

                <Stack
                    spacing={1}
                    className="hm-analytics-kpi-stack"
                >
                    <Typography className="hm-analytics-kpi-label">
                        {title}
                    </Typography>

                    {isLoading ? (
                        <Skeleton
                            width="65%"
                            height={44}
                            className="hm-analytics-kpi-skeleton"
                        />
                    ) : (
                        <Typography className="hm-analytics-kpi-value">
                            {value}
                        </Typography>
                    )}

                    <Typography className="hm-analytics-kpi-subtitle">
                        {subtitle}
                    </Typography>
                </Stack>

                <span className="hm-analytics-kpi-line" />
            </CardContent>
        </Card>
    );
}

AnalyticsKpiCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    index: PropTypes.number.isRequired,
};

export default function AnalyticsKpiCards({
    data,
    isLoading = false,
}) {
    const summary = data || {};

    const cards = [
        {
            title: "Applications",
            value: formatNumber(
                summary.totalApplications
            ),
            subtitle: `${formatPercentage(
                summary.applicationGrowthRate
            )} growth`,
        },
        {
            title: "Interviews",
            value: formatNumber(
                summary.totalInterviews
            ),
            subtitle: `${formatPercentage(
                summary.interviewConversionRate
            )} conversion`,
        },
        {
            title: "Offers",
            value: formatNumber(
                summary.totalOffers
            ),
            subtitle: `${formatPercentage(
                summary.offerAcceptanceRate
            )} acceptance`,
        },
        {
            title: "Hires",
            value: formatNumber(
                summary.totalHires
            ),
            subtitle: `${formatPercentage(
                summary.hiringConversionRate
            )} hiring conversion`,
        },
        {
            title: "Time to Interview",
            value: formatDays(
                summary.averageTimeToInterviewDays
            ),
            subtitle: "Average duration",
        },
        {
            title: "Time to Hire",
            value: formatDays(
                summary.averageTimeToHireDays
            ),
            subtitle: "Average duration",
        },
    ];

    return (
        <Grid
            container
            spacing={2}
            className="hm-analytics-kpi-grid"
        >
            {cards.map(
                (
                    card,
                    index
                ) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2}
                        key={card.title}
                        className="hm-analytics-kpi-grid-item"
                    >
                        <AnalyticsKpiCard
                            title={card.title}
                            value={card.value}
                            subtitle={card.subtitle}
                            isLoading={isLoading}
                            index={index}
                        />
                    </Grid>
                )
            )}
        </Grid>
    );
}

AnalyticsKpiCards.propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
};
