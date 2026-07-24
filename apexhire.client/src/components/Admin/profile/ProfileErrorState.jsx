import PropTypes from "prop-types";
import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

export default function ProfileErrorState({
    message = "Something went wrong while loading your profile.",
    onRetry,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 6,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                textAlign: "center",
            }}
        >
            <Stack
                spacing={3}
                alignItems="center"
            >
                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "error.light",
                        color: "error.main",
                    }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{
                            fontSize: 40,
                        }}
                    />
                </Box>

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Unable to Load Profile
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        We couldn't retrieve your administrator profile.
                    </Typography>
                </Box>

                <Alert
                    severity="error"
                    sx={{
                        width: "100%",
                        textAlign: "left",
                    }}
                >
                    {message}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={
                        <RefreshOutlinedIcon />
                    }
                    onClick={onRetry}
                >
                    Try Again
                </Button>
            </Stack>
        </Paper>
    );
}

ProfileErrorState.propTypes = {
    message:
        PropTypes.string,

    onRetry:
        PropTypes.func.isRequired,
};
