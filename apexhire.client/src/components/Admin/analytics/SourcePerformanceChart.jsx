import PropTypes from "prop-types";

import {
    Box,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    formatNumber,
    formatPercentage,
} from "../../../utils/adminAnalyticsHelpers";

import "./AdminAnalyticsVisuals.css";

function CustomTooltip({
    active,
    payload,
    label,
}) {
    if (
        !active ||
        !payload?.length
    ) {
        return null;
    }

    const sourceData =
        payload[0]?.payload || {};

    return (
        <Paper
            elevation={0}
            className="condo-analytics-tooltip condo-source-tooltip"
        >
            <Typography className="condo-tooltip-title">
                {label}
            </Typography>

            <div className="condo-tooltip-grid">
                <div>
                    <span>Applications</span>
                    <strong>
                        {formatNumber(
                            sourceData.applications
                        )}
                    </strong>
                </div>

                <div>
                    <span>Interviews</span>
                    <strong>
                        {formatNumber(
                            sourceData.interviews
                        )}
                    </strong>
                </div>

                <div>
                    <span>Hires</span>
                    <strong>
                        {formatNumber(
                            sourceData.hires
                        )}
                    </strong>
                </div>

                <div>
                    <span>Conversion</span>
                    <strong>
                        {formatPercentage(
                            sourceData.conversionRate
                        )}
                    </strong>
                </div>
            </div>
        </Paper>
    );
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default function SourcePerformanceChart({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            className="condo-analytics-card condo-analytics-chart-card"
        >
            <div className="condo-card-glow" />

            <Box className="condo-analytics-card-header">
                <div>
                    <Typography className="condo-analytics-card-eyebrow">
                        Acquisition channels
                    </Typography>

                    <Typography
                        variant="h6"
                        className="condo-analytics-card-title"
                    >
                        Candidate Source Performance
                    </Typography>

                    <Typography className="condo-analytics-card-description">
                        Compare applications, interviews, and hires by source.
                    </Typography>
                </div>

                <div className="condo-chart-badge">
                    Sources
                </div>
            </Box>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    height={340}
                    className="condo-analytics-skeleton"
                />
            ) : data.length === 0 ? (
                <Box className="condo-analytics-empty-state">
                    <div className="condo-empty-icon">
                        <span />
                        <span />
                        <span />
                    </div>

                    <Typography className="condo-empty-title">
                        No source data
                    </Typography>

                    <Typography className="condo-empty-text">
                        Candidate source performance will appear here.
                    </Typography>
                </Box>
            ) : (
                <Box className="condo-analytics-chart-area condo-source-chart-area">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={data}
                            margin={{
                                top: 12,
                                right: 22,
                                left: 0,
                                bottom: 24,
                            }}
                            barGap={5}
                        >
                            <CartesianGrid
                                stroke="rgba(116, 0, 27, 0.10)"
                                strokeDasharray="4 6"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="source"
                                tick={{
                                    fontSize: 12,
                                    fill: "#6f5360",
                                }}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                angle={-20}
                                textAnchor="end"
                                height={70}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fontSize: 12,
                                    fill: "#6f5360",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "rgba(255, 196, 0, 0.08)",
                                }}
                                content={<CustomTooltip />}
                            />

                            <Legend
                                iconType="circle"
                                wrapperStyle={{
                                    paddingTop: "10px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                }}
                            />

                            <Bar
                                dataKey="applications"
                                name="Applications"
                                fill="#005baa"
                                radius={[7, 7, 0, 0]}
                                animationDuration={1100}
                            />

                            <Bar
                                dataKey="interviews"
                                name="Interviews"
                                fill="#ffc400"
                                radius={[7, 7, 0, 0]}
                                animationDuration={1300}
                            />

                            <Bar
                                dataKey="hires"
                                name="Hires"
                                fill="#74001b"
                                radius={[7, 7, 0, 0]}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}

SourcePerformanceChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            source: PropTypes.string,
            applications: PropTypes.number,
            interviews: PropTypes.number,
            hires: PropTypes.number,
            conversionRate: PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
