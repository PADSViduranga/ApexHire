import PropTypes from "prop-types";
import {
    Box,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import {
    formatNumber,
} from "../../../utils/adminReportHelpers";

const CHART_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#7c3aed",
    "#dc2626",
    "#0891b2",
];

function CustomTooltip({
    active,
    payload,
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
                {item?.label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={700}
            >
                {formatNumber(
                    item?.value
                )}{" "}
                users
            </Typography>
        </Paper>
    );
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
};

export default function UserDistributionChart({
    data = [],
    isLoading = false,
}) {
    const totalUsers =
        data.reduce(
            (total, item) =>
                total +
                Number(
                    item.value || 0
                ),
            0
        );

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
                    User Distribution
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Registered users grouped by
                    platform role.
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
                        No user distribution data
                        available.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        height: 320,
                        position: "relative",
                    }}
                >
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="45%"
                                innerRadius={70}
                                outerRadius={105}
                                paddingAngle={3}
                            >
                                {data.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <Cell
                                            key={`${item.label}-${index}`}
                                            fill={
                                                CHART_COLORS[
                                                    index %
                                                        CHART_COLORS.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>

                            <Tooltip
                                content={
                                    <CustomTooltip />
                                }
                            />

                            <Legend
                                verticalAlign="bottom"
                                height={36}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <Box
                        sx={{
                            position:
                                "absolute",
                            top: "39%",
                            left: "50%",
                            transform:
                                "translate(-50%, -50%)",
                            textAlign:
                                "center",
                            pointerEvents:
                                "none",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {formatNumber(
                                totalUsers
                            )}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total Users
                        </Typography>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}

UserDistributionChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label:
                PropTypes.string.isRequired,
            value:
                PropTypes.number.isRequired,
        })
    ),

    isLoading: PropTypes.bool,
};
