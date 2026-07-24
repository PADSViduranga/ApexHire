import PropTypes from "prop-types";
import {
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";

import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

export default function ProfileFormActions({
    hasChanges = false,
    isSaving = false,
    disabled = false,
    onReset,
    onSave,
}) {
    return (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row",
            }}
            spacing={1.5}
            justifyContent="flex-end"
        >
            <Button
                variant="outlined"
                startIcon={
                    <RestartAltOutlinedIcon />
                }
                onClick={onReset}
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
                    isSaving
                        ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        )
                        : (
                            <SaveOutlinedIcon />
                        )
                }
                onClick={onSave}
                disabled={
                    disabled ||
                    isSaving ||
                    !hasChanges
                }
            >
                {isSaving
                    ? "Saving..."
                    : "Save Changes"}
            </Button>
        </Stack>
    );
}

ProfileFormActions.propTypes = {
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
