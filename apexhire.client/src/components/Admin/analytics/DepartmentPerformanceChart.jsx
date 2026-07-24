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
    formatDays,
    formatNumber,
} from "../../../utils/adminAnalyticsHelpers";

import "./DepartmentPerformanceChart.css";

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

    const departmentData =
        payload[0]?.payload || {};

    return (
        <Paper
            elevation={0}
            className="hm-department-tooltip"
        >
            <Typography className="hm-department-tooltip-title">
                {label}
            </Typography>

            <Typography>
                Applications:{" "}
                <strong>
                    {formatNumber(
                        departmentData.applications
                    )}
                </strong>
            </Typography>

            <Typography>
                Interviews:{" "}
                <strong>
                    {formatNumber(
                        departmentData.interviews
                    )}
                </strong>
            </Typography>

            <Typography>
                Offers:{" "}
                <strong>
                    {formatNumber(
                        departmentData.offers
                    )}
                </strong>
            </Typography>

            <Typography>
                Hires:{" "}
                <strong>
                    {formatNumber(
                        departmentData.hires
                    )}
                </strong>
            </Typography>

            <Typography>
                Avg. Time to Hire:{" "}
                <strong>
                    {formatDays(
                        departmentData
                            .averageTimeToHireDays
                    )}
                </strong>
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

export default function DepartmentPerformanceChart({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            className="hm-department-chart"
        >
            <Box className="hm-department-chart-header">
                <Typography className="hm-department-chart-eyebrow">
                    Department Comparison
                </Typography>

                <Typography className="hm-department-chart-title">
                    Department Performance
                </Typography>

                <Typography className="hm-department-chart-subtitle">
                    Compare applications, interviews,
                    offers and hires across departments.
                </Typography>
            </Box>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    height={340}
                    className="hm-department-chart-skeleton"
                />
            ) : data.length === 0 ? (
                <Box className="hm-department-chart-empty">
                    <span>DP</span>

                    <Typography>
                        No department performance
                        data available.
                    </Typography>
                </Box>
            ) : (
                <Box className="hm-department-chart-body">
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
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="4 5"
                                stroke="rgba(94, 41, 47, 0.11)"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="department"
                                tick={{
                                    fontSize: 12,
                                    fill: "#7a6f70",
                                }}
                                axisLine={{
                                    stroke:
                                        "rgba(94, 41, 47, 0.15)",
                                }}
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
                                    fill: "#7a6f70",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    fill:
                                        "rgba(208, 174, 87, 0.07)",
                                }}
                                content={
                                    <CustomTooltip />
                                }
                            />

                            <Legend
                                wrapperStyle={{
                                    fontSize: "12px",
                                    color: "#665b5d",
                                }}
                            />

                            <Bar
                                dataKey="applications"
                                name="Applications"
                                fill="#29445f"
                                radius={[
                                    5,
                                    5,
                                    0,
                                    0,
                                ]}
                            />

                            <Bar
                                dataKey="interviews"
                                name="Interviews"
                                fill="#c89d39"
                                radius={[
                                    5,
                                    5,
                                    0,
                                    0,
                                ]}
                            />

                            <Bar
                                dataKey="offers"
                                name="Offers"
                                fill="#8d5157"
                                radius={[
                                    5,
                                    5,
                                    0,
                                    0,
                                ]}
                            />

                            <Bar
                                dataKey="hires"
                                name="Hires"
                                fill="#53765f"
                                radius={[
                                    5,
                                    5,
                                    0,
                                    0,
                                ]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}

DepartmentPerformanceChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            departmentId: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            department: PropTypes.string,
            applications: PropTypes.number,
            interviews: PropTypes.number,
            offers: PropTypes.number,
            hires: PropTypes.number,
            averageTimeToHireDays:
                PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
