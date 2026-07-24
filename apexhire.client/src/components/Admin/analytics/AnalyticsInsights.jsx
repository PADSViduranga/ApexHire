import PropTypes from "prop-types";

import {
    Alert,
    Box,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import {
    ANALYTICS_INSIGHT_SEVERITIES,
} from "../../../utils/adminAnalyticsConstants";

import "./AnalyticsInsights.css";

function getAlertSeverity(severity) {
    const normalizedSeverity =
        String(severity || "")
            .trim()
            .toLowerCase();

    if (
        Object.values(
            ANALYTICS_INSIGHT_SEVERITIES
        ).includes(normalizedSeverity)
    ) {
        return normalizedSeverity;
    }

    return "info";
}

export default function AnalyticsInsights({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            className="hm-analytics-insights"
        >
            <Box className="hm-analytics-insights-header">
                <Typography className="hm-analytics-insights-eyebrow">
                    Intelligent Summary
                </Typography>

                <Typography className="hm-analytics-insights-title">
                    Analytics Insights
                </Typography>

                <Typography className="hm-analytics-insights-subtitle">
                    Key findings and performance signals
                    from the selected period.
                </Typography>
            </Box>

            {isLoading ? (
                <Stack
                    spacing={1.5}
                    className="hm-analytics-insights-loading"
                >
                    {[1, 2, 3].map(item => (
                        <Skeleton
                            key={item}
                            variant="rounded"
                            height={86}
                            className="hm-analytics-insight-skeleton"
                        />
                    ))}
                </Stack>
            ) : data.length === 0 ? (
                <Box className="hm-analytics-insights-empty">
                    <span className="hm-analytics-insights-empty-icon">
                        AI
                    </span>

                    <Typography>
                        No analytics insights available.
                    </Typography>
                </Box>
            ) : (
                <Stack
                    spacing={1.5}
                    className="hm-analytics-insights-list"
                >
                    {data.map(
                        (
                            insight,
                            index
                        ) => (
                            <Alert
                                key={
                                    insight.id ??
                                    `${insight.title}-${index}`
                                }
                                severity={getAlertSeverity(
                                    insight.severity
                                )}
                                variant="outlined"
                                className="hm-analytics-insight-alert"
                            >
                                <Typography className="hm-analytics-insight-title">
                                    {insight.title}
                                </Typography>

                                {insight.description && (
                                    <Typography className="hm-analytics-insight-description">
                                        {insight.description}
                                    </Typography>
                                )}

                                {insight.metric &&
                                    insight.value !== null &&
                                    insight.value !== undefined && (
                                        <Typography className="hm-analytics-insight-metric">
                                            {insight.metric}:{" "}
                                            {String(
                                                insight.value
                                            )}
                                        </Typography>
                                    )}
                            </Alert>
                        )
                    )}
                </Stack>
            )}
        </Paper>
    );
}

AnalyticsInsights.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            title: PropTypes.string,
            description: PropTypes.string,
            severity: PropTypes.string,
            metric: PropTypes.string,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ),

    isLoading: PropTypes.bool,
};
