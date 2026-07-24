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
} from "../../../utils/adminReportHelpers";

function KpiCard({
    title,
    value,
    subtitle,
    isLoading = false,
}) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Stack spacing={1}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {title}
                    </Typography>

                    {isLoading ? (
                        <Skeleton
                            width="65%"
                            height={44}
                        />
                    ) : (
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {value}
                        </Typography>
                    )}

                    {subtitle && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

KpiCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    isLoading: PropTypes.bool,
};

export default function ReportKpiCards({
    data,
    isLoading = false,
}) {
    const summary = data || {};

    const cards = [
        {
            title: "Total Users",
            value: formatNumber(
                summary.totalUsers
            ),
            subtitle: `${formatNumber(
                summary.totalCandidates
            )} candidates`,
        },
        {
            title: "Total Jobs",
            value: formatNumber(
                summary.totalJobs
            ),
            subtitle: `${formatNumber(
                summary.activeJobs
            )} active jobs`,
        },
        {
            title: "Applications",
            value: formatNumber(
                summary.totalApplications
            ),
            subtitle: `${formatNumber(
                summary.shortlistedApplications
            )} shortlisted`,
        },
        {
            title: "Interviews",
            value: formatNumber(
                summary.interviewsScheduled
            ),
            subtitle: `${formatNumber(
                summary.offersMade
            )} offers made`,
        },
        {
            title: "Successful Hires",
            value: formatNumber(
                summary.hires
            ),
            subtitle: `${formatPercentage(
                summary.hiringSuccessRate
            )} success rate`,
        },
        {
            title: "Average Time to Hire",
            value: formatDays(
                summary.averageTimeToHireDays
            ),
            subtitle: `${formatNumber(
                summary.rejectedApplications
            )} rejected`,
        },
    ];

    return (
        <Grid
            container
            spacing={2}
            sx={{
                mb: 3,
            }}
        >
            {cards.map(card => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    key={card.title}
                >
                    <KpiCard
                        title={card.title}
                        value={card.value}
                        subtitle={
                            card.subtitle
                        }
                        isLoading={
                            isLoading
                        }
                    />
                </Grid>
            ))}
        </Grid>
    );
}

ReportKpiCards.propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
};
