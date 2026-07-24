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
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    formatPercentage,
} from "../../../utils/adminAnalyticsHelpers";

import "./ConversionRateChart.css";

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
            className="hm-conversion-tooltip"
        >
            <Typography className="hm-conversion-tooltip-label">
                {label}
            </Typography>

            <Typography className="hm-conversion-tooltip-value">
                {formatPercentage(
                    payload[0]?.value
                )}
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

export default function ConversionRateChart({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            className="hm-conversion-chart"
        >
            <Box className="hm-conversion-chart-header">
                <Typography className="hm-conversion-chart-eyebrow">
                    Hiring Funnel
                </Typography>

                <Typography className="hm-conversion-chart-title">
                    Conversion Rates
                </Typography>

                <Typography className="hm-conversion-chart-subtitle">
                    Conversion performance across
                    every stage of the hiring process.
                </Typography>
            </Box>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    height={320}
                    className="hm-conversion-chart-skeleton"
                />
            ) : data.length === 0 ? (
                <Box className="hm-conversion-chart-empty">
                    <span>CR</span>

                    <Typography>
                        No conversion-rate data
                        available.
                    </Typography>
                </Box>
            ) : (
                <Box className="hm-conversion-chart-body">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
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
                                    id="conversionBarGradient"
                                    x1="0"
                                    y1="1"
                                    x2="0"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#5e292f"
                                    />

                                    <stop
                                        offset="65%"
                                        stopColor="#9a5b5f"
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="#d0ae57"
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
                            />

                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={value =>
                                    `${value}%`
                                }
                                tick={{
                                    fontSize: 12,
                                    fill: "#7a6f70",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    fill:
                                        "rgba(197, 161, 74, 0.08)",
                                }}
                                content={
                                    <CustomTooltip />
                                }
                            />

                            <Bar
                                dataKey="value"
                                fill="url(#conversionBarGradient)"
                                radius={[
                                    9,
                                    9,
                                    0,
                                    0,
                                ]}
                                maxBarSize={70}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}

ConversionRateChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
