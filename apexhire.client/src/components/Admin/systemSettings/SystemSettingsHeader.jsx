import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function SystemSettingsHeader({
    environment = "",
    version = "",
    isReloading = false,
    onReload,
}) {
    return (
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
                    md: "row",
                }}
                spacing={2}
                alignItems={{
                    xs: "flex-start",
                    md: "center",
                }}
                justifyContent="space-between"
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            flexShrink: 0,
                        }}
                    >
                        <SettingsOutlinedIcon
                            sx={{
                                fontSize: 30,
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            System Settings
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Configure application behaviour, security, email, and maintenance options.
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ mt: 1.5 }}
                        >
                            {environment && (
                                <Chip
                                    size="small"
                                    label={`Environment: ${environment}`}
                                    color={
                                        environment
                                            .toLowerCase()
                                            .includes(
                                                "production"
                                            )
                                            ? "success"
                                            : "warning"
                                    }
                                    variant="outlined"
                                />
                            )}

                            {version && (
                                <Chip
                                    size="small"
                                    label={`Version: ${version}`}
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Box>
                </Stack>

                <Button
                    variant="outlined"
                    startIcon={
                        <RefreshOutlinedIcon />
                    }
                    onClick={onReload}
                    disabled={isReloading}
                >
                    {isReloading
                        ? "Refreshing..."
                        : "Refresh"}
                </Button>
            </Stack>
        </Paper>
    );
}

SystemSettingsHeader.propTypes = {
    environment:
        PropTypes.string,

    version:
        PropTypes.string,

    isReloading:
        PropTypes.bool,

    onReload:
        PropTypes.func.isRequired,
};
