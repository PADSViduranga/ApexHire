import {
    Box,
    CircularProgress,
    Grid,
    Paper,
    Skeleton,
    Stack,
} from "@mui/material";

export default function ProfileLoadingState() {
    return (
        <Stack spacing={3}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2.5}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                >
                    <Skeleton
                        variant="circular"
                        width={88}
                        height={88}
                    />

                    <Box sx={{ flex: 1 }}>
                        <Skeleton
                            width="45%"
                            height={42}
                        />

                        <Skeleton
                            width="35%"
                            height={28}
                        />

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 1 }}
                        >
                            <Skeleton
                                variant="rounded"
                                width={90}
                                height={28}
                            />

                            <Skeleton
                                variant="rounded"
                                width={80}
                                height={28}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    xs={12}
                    lg={8}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: 1,
                            borderColor:
                                "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Skeleton
                            width={220}
                            height={36}
                        />

                        <Skeleton
                            width="65%"
                            height={24}
                            sx={{ mb: 3 }}
                        />

                        <Grid
                            container
                            spacing={2}
                        >
                            {Array.from({
                                length: 6,
                            }).map(
                                (_, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={
                                            index < 4
                                                ? 6
                                                : 12
                                        }
                                        key={
                                            index
                                        }
                                    >
                                        <Skeleton
                                            variant="rounded"
                                            height={
                                                index === 5
                                                    ? 120
                                                    : 56
                                            }
                                        />
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    lg={4}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            minHeight: 360,
                            border: 1,
                            borderColor:
                                "divider",
                            borderRadius: 2,
                            display: "grid",
                            placeItems:
                                "center",
                        }}
                    >
                        <CircularProgress />
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}
