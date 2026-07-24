import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import RoleAvatar from "./RoleAvatar";
import RoleStatusChip from "./RoleStatusChip";

export default function RoleDetailsDialog({
    open = false,
    role = null,
    onClose
}) {
    const handleClose = (
        event,
        reason
    ) => {
        if (reason === "backdropClick") {
            return;
        }

        onClose?.();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="role-details-dialog-title"
        >
            <DialogTitle
                id="role-details-dialog-title"
                sx={{
                    pr: 7
                }}
            >
                Role Details

                <IconButton
                    aria-label="Close role details"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12
                    }}
                >
                    <CloseOutlinedIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent>
                {role ? (
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            <RoleAvatar
                                role={role}
                                size={64}
                            />

                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {role.displayName}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    System role
                                </Typography>
                            </Box>
                        </Stack>

                        <RoleStatusChip
                            role={role}
                            sx={{
                                alignSelf: "flex-start"
                            }}
                        />

                        <Divider />

                        <Stack spacing={2}>
                            <DetailRow
                                label="Role Name"
                                value={role.name}
                            />

                            <DetailRow
                                label="Display Name"
                                value={role.displayName}
                            />

                            <DetailRow
                                label="Role Value"
                                value={role.value}
                            />

                            <DetailRow
                                label="Description"
                                value={role.description}
                            />
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "action.hover"
                            }}
                        >
                            <LockOutlinedIcon
                                color="action"
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                This is a predefined system role and cannot be edited from this screen.
                            </Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <Typography
                        color="text.secondary"
                    >
                        No role selected.
                    </Typography>
                )}
            </DialogContent>

            <Divider />

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function DetailRow({
    label,
    value
}) {
    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={{
                xs: 0.5,
                sm: 2
            }}
            justifyContent="space-between"
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    minWidth: 130
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                textAlign={{
                    xs: "left",
                    sm: "right"
                }}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value ?? "—"}
            </Typography>
        </Stack>
    );
}

