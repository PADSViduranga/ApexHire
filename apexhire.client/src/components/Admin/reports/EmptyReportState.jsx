import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function EmptyReportState({
    onRefresh,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 6,
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                }}
            >
                <AssessmentOutlinedIcon
                    sx={{
                        fontSize: 36,
                        color: "text.secondary",
                    }}
                />
            </Box>

            <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
            >
                No Report Data Available
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    maxWidth: 460,
                    mx: "auto",
                    mb: 3,
                }}
            >
                No report information matched the selected filters.
                Change the reporting period or filters and try again.
            </Typography>

            <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
            >
                Refresh Report
            </Button>
        </Paper>
    );
}
