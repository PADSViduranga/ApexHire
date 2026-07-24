import PropTypes from "prop-types";

import {
    Box,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    formatDays,
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

    return (
        <Paper
            elevation={0}
            className="condo-analytics-tooltip"
        >
            <Typography className="condo-tooltip-label">
                {label}
            </Typography>

            {payload.map(item => (
                <div
                    key={item.dataKey}
                    className="condo-tooltip-row"
                >
                    <span
                        className="condo-tooltip-dot"
                        style={{
                            backgroundColor: item.color,
                        }}
                    />

                    <Typography className="condo-tooltip-value">
                        {item.name}:{" "}
                        <strong>
                            {formatDays(item.value)}
                        </strong>
                    </Typography>
                </div>
            ))}
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

export default function HiringVelocityChart({
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
                        Recruitment speed
                    </Typography>

                    <Typography
                        variant="h6"
                        className="condo-analytics-card-title"
                    >
                        Hiring Velocity
                    </Typography>

                    <Typography className="condo-analytics-card-description">
                        Average time required to move candidates through hiring stages.
                    </Typography>
                </div>

                <div className="condo-chart-badge">
                    Days
                </div>
            </Box>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    height={320}
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
                        No velocity data
                    </Typography>

                    <Typography className="condo-empty-text">
                        Hiring velocity information will appear here.
                    </Typography>
                </Box>
            ) : (
                <Box className="condo-analytics-chart-area">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={data}
                            margin={{
                                top: 14,
                                right: 22,
                                left: 0,
                                bottom: 8,
                            }}
                        >
                            <CartesianGrid
                                stroke="rgba(116, 0, 27, 0.10)"
                                strokeDasharray="4 6"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="label"
                                tick={{
                                    fontSize: 12,
                                    fill: "#6f5360",
                                }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={20}
                            />

                            <YAxis
                                tick={{
                                    fontSize: 12,
                                    fill: "#6f5360",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    stroke: "#ffc400",
                                    strokeWidth: 1,
                                    strokeDasharray: "4 4",
                                }}
                                content={<CustomTooltip />}
                            />

                            <Legend
                                iconType="circle"
                                wrapperStyle={{
                                    paddingTop: "16px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="interviewDays"
                                name="Interview"
                                stroke="#005baa"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: "#005baa",
                                    stroke: "#ffffff",
                                    strokeWidth: 3,
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="offerDays"
                                name="Offer"
                                stroke="#ffc400"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: "#ffc400",
                                    stroke: "#ffffff",
                                    strokeWidth: 3,
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="hireDays"
                                name="Hire"
                                stroke="#74001b"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: "#74001b",
                                    stroke: "#ffffff",
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

HiringVelocityChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            interviewDays: PropTypes.number,
            offerDays: PropTypes.number,
            hireDays: PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
