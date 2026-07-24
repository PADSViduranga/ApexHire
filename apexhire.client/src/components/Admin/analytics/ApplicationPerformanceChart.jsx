import PropTypes from "prop-types";

import {
    Box,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    formatNumber,
} from "../../../utils/adminAnalyticsHelpers";

import "./ApplicationPerformanceChart.css";

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

    return (
        <Paper
            elevation={0}
            className="hm-application-tooltip"
        >
            <Typography className="hm-application-tooltip-label">
                {label}
            </Typography>

            <Typography className="hm-application-tooltip-value">
                {formatNumber(
                    payload[0]?.value
                )}{" "}
                applications
            </Typography>
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

export default function ApplicationPerformanceChart({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            className="hm-application-chart"
        >
            <Box className="hm-application-chart-header">
                <Typography className="hm-application-chart-eyebrow">
                    Application Activity
                </Typography>

                <Typography className="hm-application-chart-title">
                    Application Performance
                </Typography>

                <Typography className="hm-application-chart-subtitle">
                    Application volume across the
                    selected reporting period.
                </Typography>
            </Box>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    height={320}
                    className="hm-application-chart-skeleton"
                />
            ) : data.length === 0 ? (
                <Box className="hm-application-chart-empty">
                    <span>AP</span>

                    <Typography>
                        No application performance
                        data available.
                    </Typography>
                </Box>
            ) : (
                <Box className="hm-application-chart-body">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={data}
                            margin={{
                                top: 15,
                                right: 20,
                                left: 0,
                                bottom: 10,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="applicationLineGradient"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#6f3036"
                                    />

                                    <stop
                                        offset="55%"
                                        stopColor="#c5a14a"
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="#29445f"
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 5"
                                stroke="rgba(111, 48, 54, 0.12)"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="label"
                                tick={{
                                    fontSize: 12,
                                    fill: "#7a6f70",
                                }}
                                axisLine={{
                                    stroke:
                                        "rgba(111, 48, 54, 0.16)",
                                }}
                                tickLine={false}
                                minTickGap={20}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fontSize: 12,
                                    fill: "#7a6f70",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    stroke:
                                        "rgba(197, 161, 74, 0.35)",
                                    strokeWidth: 1,
                                }}
                                content={
                                    <CustomTooltip />
                                }
                            />

                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="url(#applicationLineGradient)"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{
                                    r: 7,
                                    fill: "#6f3036",
                                    stroke: "#f1d98b",
                                    strokeWidth: 3,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}

ApplicationPerformanceChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
