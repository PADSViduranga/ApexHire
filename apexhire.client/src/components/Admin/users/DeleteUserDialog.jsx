import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

import { useState } from "react";

export default function DeleteUserDialog({

    open,

    onClose,

    onConfirm,

    user

}) {

    const [loading, setLoading] = useState(false);

    async function handleDelete() {

        try {

            setLoading(true);

            await onConfirm();

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="xs"
        >

            <DialogTitle>

                Delete User

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    This action will permanently delete

                    <strong>

                        {" "}
                        {user?.fullName ?? "this user"}

                    </strong>

                    .

                </DialogContentText>

                <DialogContentText
                    sx={{ mt:2 }}
                >

                    This action cannot be undone.

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button

                    disabled={loading}

                    onClick={onClose}

                >

                    Cancel

                </Button>

                <Button

                    color="error"

                    variant="contained"

                    disabled={loading}

                    onClick={handleDelete}

                    startIcon={
                        loading
                            ? <CircularProgress size={18}/>
                            : null
                    }

                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

}
