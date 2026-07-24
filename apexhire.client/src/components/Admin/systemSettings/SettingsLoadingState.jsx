import {
    Box,
    CircularProgress,
    Paper,
    Skeleton,
    Stack,
} from "@mui/material";

export default function SettingsLoadingState() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack
                spacing={3}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress
                        size={28}
                    />

                    <Skeleton
                        variant="text"
                        width={220}
                        height={36}
                    />
                </Stack>

                {[1, 2, 3, 4].map(
                    item => (
                        <Paper
                            key={item}
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: 2,
                            }}
                        >
                            <Stack
                                spacing={2}
                            >
                                <Skeleton
                                    variant="text"
                                    width={180}
                                    height={30}
                                />

                                <Skeleton
                                    variant="text"
                                    width="60%"
                                    height={20}
                                />

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "1fr 1fr",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Skeleton
                                        variant="rounded"
                                        height={56}
                                    />

                                    <Skeleton
                                        variant="rounded"
                                        height={56}
                                    />

                                    <Skeleton
                                        variant="rounded"
                                        height={56}
                                    />

                                    <Skeleton
                                        variant="rounded"
                                        height={56}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    )
                )}
            </Stack>
        </Paper>
    );
}
