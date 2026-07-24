import PropTypes from "prop-types";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import {
    useState,
} from "react";

export default function ChangePasswordForm({
    open,
    form,
    errors = {},
    isSubmitting = false,
    onChange,
    onSubmit,
    onClose,
}) {
    const [
        visibility,
        setVisibility,
    ] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    function handleChange(event) {
        onChange(
            event.target.name,
            event.target.value
        );
    }

    function toggleVisibility(
        field
    ) {
        setVisibility(current => ({
            ...current,
            [field]:
                !current[field],
        }));
    }

    function handleSubmit(
        event
    ) {
        event.preventDefault();
        onSubmit();
    }

    function getPasswordAdornment(
        field,
        label
    ) {
        return (
            <InputAdornment
                position="end"
            >
                <IconButton
                    edge="end"
                    aria-label={
                        visibility[field]
                            ? `Hide ${label}`
                            : `Show ${label}`
                    }
                    onClick={() =>
                        toggleVisibility(
                            field
                        )
                    }
                    disabled={
                        isSubmitting
                    }
                >
                    {visibility[field]
                        ? (
                            <VisibilityOffOutlinedIcon />
                        )
                        : (
                            <VisibilityOutlinedIcon />
                        )}
                </IconButton>
            </InputAdornment>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={
                isSubmitting
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
            component="form"
            onSubmit={
                handleSubmit
            }
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 2,
                }}
            >
                Change Password

                <IconButton
                    aria-label="Close password form"
                    onClick={
                        onClose
                    }
                    disabled={
                        isSubmitting
                    }
                >
                    <CloseOutlinedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
            >
                <Stack
                    spacing={2.5}
                    sx={{ pt: 1 }}
                >
                    <TextField
                        fullWidth
                        required
                        autoFocus
                        name="currentPassword"
                        label="Current Password"
                        type={
                            visibility.currentPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            form.currentPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            isSubmitting
                        }
                        error={Boolean(
                            errors.currentPassword
                        )}
                        helperText={
                            errors.currentPassword
                        }
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment:
                                getPasswordAdornment(
                                    "currentPassword",
                                    "current password"
                                ),
                        }}
                    />

                    <TextField
                        fullWidth
                        required
                        name="newPassword"
                        label="New Password"
                        type={
                            visibility.newPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            form.newPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            isSubmitting
                        }
                        error={Boolean(
                            errors.newPassword
                        )}
                        helperText={
                            errors.newPassword
                        }
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment:
                                getPasswordAdornment(
                                    "newPassword",
                                    "new password"
                                ),
                        }}
                    />

                    <TextField
                        fullWidth
                        required
                        name="confirmPassword"
                        label="Confirm New Password"
                        type={
                            visibility.confirmPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            form.confirmPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            isSubmitting
                        }
                        error={Boolean(
                            errors.confirmPassword
                        )}
                        helperText={
                            errors.confirmPassword
                        }
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment:
                                getPasswordAdornment(
                                    "confirmPassword",
                                    "confirmed password"
                                ),
                        }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                }}
            >
                <Button
                    onClick={
                        onClose
                    }
                    disabled={
                        isSubmitting
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={
                        isSubmitting
                    }
                    startIcon={
                        isSubmitting
                            ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            )
                            : null
                    }
                >
                    {isSubmitting
                        ? "Changing..."
                        : "Change Password"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ChangePasswordForm.propTypes = {
    open:
        PropTypes.bool.isRequired,

    form: PropTypes.shape({
        currentPassword:
            PropTypes.string.isRequired,
        newPassword:
            PropTypes.string.isRequired,
        confirmPassword:
            PropTypes.string.isRequired,
    }).isRequired,

    errors:
        PropTypes.object,

    isSubmitting:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,

    onSubmit:
        PropTypes.func.isRequired,

    onClose:
        PropTypes.func.isRequired,
};
