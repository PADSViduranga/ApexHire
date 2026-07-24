import {
    Box,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import "./AnalyticsLoadingState.css";

export default function AnalyticsLoadingState() {
    return (
        <Stack
            spacing={3}
            className="hm-analytics-loading-state"
        >
            <Box className="hm-analytics-loading-header">
                <Box className="hm-analytics-loading-spinner">
                    <span />
                </Box>

                <Box>
                    <Typography className="hm-analytics-loading-title">
                        Preparing analytics
                    </Typography>

                    <Typography className="hm-analytics-loading-subtitle">
                        Loading recruitment performance
                        and operational insights.
                    </Typography>
                </Box>
            </Box>

            <Paper
                elevation={0}
                className="hm-analytics-loading-filter"
            >
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map(item => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={item}
                        >
                            <Skeleton
                                variant="rounded"
                                height={44}
                                className="hm-analytics-loading-skeleton"
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box className="hm-analytics-loading-actions">
                    <Skeleton
                        variant="rounded"
                        width={100}
                        height={38}
                        className="hm-analytics-loading-skeleton"
                    />

                    <Skeleton
                        variant="rounded"
                        width={110}
                        height={38}
                        className="hm-analytics-loading-skeleton"
                    />
                </Box>
            </Paper>

            <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map(item => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2}
                        key={item}
                    >
                        <Skeleton
                            variant="rounded"
                            height={155}
                            className="hm-analytics-loading-card"
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {[1, 2].map(item => (
                    <Grid
                        item
                        xs={12}
                        lg={6}
                        key={item}
                    >
                        <Skeleton
                            variant="rounded"
                            height={390}
                            className="hm-analytics-loading-panel"
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {[1, 2].map(item => (
                    <Grid
                        item
                        xs={12}
                        lg={6}
                        key={item}
                    >
                        <Skeleton
                            variant="rounded"
                            height={390}
                            className="hm-analytics-loading-panel"
                        />
                    </Grid>
                ))}
            </Grid>

            <Skeleton
                variant="rounded"
                height={420}
                className="hm-analytics-loading-panel"
            />
        </Stack>
    );
}
