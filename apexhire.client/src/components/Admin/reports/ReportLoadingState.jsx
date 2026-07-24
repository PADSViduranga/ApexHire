import {
    Box,
    CircularProgress,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

export default function ReportLoadingState() {
    return (
        <Paper
            elevation={0}
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 5,
            }}
        >
            <Stack
                spacing={4}
                alignItems="center"
            >
                <CircularProgress
                    size={48}
                />

                <Box
                    textAlign="center"
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Generating Report
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Please wait while we prepare
                        the latest analytics.
                    </Typography>
                </Box>

                <Stack
                    spacing={2}
                    width="100%"
                >
                    <Skeleton
                        variant="rounded"
                        height={80}
                    />

                    <Skeleton
                        variant="rounded"
                        height={320}
                    />

                    <Skeleton
                        variant="rounded"
                        height={260}
                    />

                    <Skeleton
                        variant="rounded"
                        height={260}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}
