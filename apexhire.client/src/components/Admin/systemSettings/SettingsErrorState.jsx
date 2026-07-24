import PropTypes from "prop-types";
import {
    Alert,
    AlertTitle,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

export default function SettingsErrorState({
    message = "Unable to load system settings.",
    isRetrying = false,
    onRetry,
}) {
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
                alignItems="flex-start"
            >
                <Alert
                    severity="error"
                    sx={{
                        width: "100%",
                    }}
                >
                    <AlertTitle>
                        System Settings Error
                    </AlertTitle>

                    {message}
                </Alert>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Check the backend connection and try loading the settings again.
                </Typography>

                <Button
                    variant="contained"
                    startIcon={
                        <RefreshOutlinedIcon />
                    }
                    onClick={
                        onRetry
                    }
                    disabled={
                        isRetrying
                    }
                >
                    {isRetrying
                        ? "Retrying..."
                        : "Try Again"}
                </Button>
            </Stack>
        </Paper>
    );
}

SettingsErrorState.propTypes = {
    message:
        PropTypes.string,

    isRetrying:
        PropTypes.bool,

    onRetry:
        PropTypes.func.isRequired,
};
