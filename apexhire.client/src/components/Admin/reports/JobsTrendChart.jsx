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
    formatNumber,
} from "../../../utils/adminReportHelpers";

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
            elevation={4}
            sx={{
                p: 1.5,
                borderRadius: 1.5,
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={700}
            >
                {formatNumber(
                    payload[0]?.value
                )}{" "}
                jobs
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

export default function JobsTrendChart({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                height: "100%",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Box mb={2}>
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Jobs Trend
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Jobs created during the selected
                    reporting period.
                </Typography>
            </Box>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    height={320}
                />
            ) : data.length === 0 ? (
                <Box
                    sx={{
                        height: 320,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No job trend data available.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        height: 320,
                    }}
                >
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 0,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="label"
                                tick={{
                                    fontSize: 12,
                                }}
                                minTickGap={20}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fontSize: 12,
                                }}
                            />

                            <Tooltip
                                content={
                                    <CustomTooltip />
                                }
                            />

                            <Bar
                                dataKey="value"
                                fill="currentColor"
                                radius={[
                                    6,
                                    6,
                                    0,
                                    0,
                                ]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}

JobsTrendChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
