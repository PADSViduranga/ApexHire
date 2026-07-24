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
    formatPercentage,
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

    const item =
        payload[0]?.payload;

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
                    item?.value
                )}
            </Typography>

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {formatPercentage(
                    item?.percentage
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

export default function HiringFunnelChart({
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
                    Hiring Funnel
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Candidate progression through
                    each hiring stage.
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
                        No hiring funnel data
                        available.
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
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 30,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                                tick={{
                                    fontSize: 12,
                                }}
                            />

                            <YAxis
                                type="category"
                                dataKey="stage"
                                width={110}
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
                                    0,
                                    6,
                                    6,
                                    0,
                                ]}
                                maxBarSize={36}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}

HiringFunnelChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            stage:
                PropTypes.string.isRequired,
            value:
                PropTypes.number.isRequired,
            percentage:
                PropTypes.number,
        })
    ),

    isLoading: PropTypes.bool,
};
