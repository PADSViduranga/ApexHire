import PropTypes from "prop-types";
import {
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

export default function SettingsFormActions({
    hasChanges = false,
    isSaving = false,
    disabled = false,
    onReset,
    onSave,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                position: "sticky",
                bottom: 16,
                zIndex: 10,
                bgcolor: "background.paper",
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2}
                alignItems={{
                    xs: "stretch",
                    sm: "center",
                }}
                justifyContent="space-between"
            >
                <Typography
                    variant="body2"
                    color={
                        hasChanges
                            ? "warning.main"
                            : "text.secondary"
                    }
                    fontWeight={
                        hasChanges
                            ? 600
                            : 400
                    }
                >
                    {hasChanges
                        ? "You have unsaved changes."
                        : "All settings are up to date."}
                </Typography>

                <Stack
                    direction={{
                        xs: "column-reverse",
                        sm: "row",
                    }}
                    spacing={1.5}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            <RestartAltOutlinedIcon />
                        }
                        onClick={
                            onReset
                        }
                        disabled={
                            disabled ||
                            isSaving ||
                            !hasChanges
                        }
                    >
                        Reset Changes
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            <SaveOutlinedIcon />
                        }
                        onClick={
                            onSave
                        }
                        disabled={
                            disabled ||
                            isSaving ||
                            !hasChanges
                        }
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save Settings"}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

SettingsFormActions.propTypes = {
    hasChanges:
        PropTypes.bool,

    isSaving:
        PropTypes.bool,

    disabled:
        PropTypes.bool,

    onReset:
        PropTypes.func.isRequired,

    onSave:
        PropTypes.func.isRequired,
};
