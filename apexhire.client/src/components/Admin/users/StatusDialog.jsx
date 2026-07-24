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

export default function StatusDialog({

    open,

    onClose,

    onConfirm,

    user

}) {

    const [loading,setLoading]=useState(false);

    async function handleConfirm(){

        try{

            setLoading(true);

            await onConfirm();

        }
        finally{

            setLoading(false);

        }

    }

    const activate=!user?.isActive;

    return(

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

                {activate
                    ? "Activate User"
                    : "Deactivate User"}

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    {activate
                        ? "Are you sure you want to activate "
                        : "Are you sure you want to deactivate "}

                    <strong>

                        {user?.fullName ?? "this user"}

                    </strong>

                    ?

                </DialogContentText>

                {!activate && (

                    <DialogContentText sx={{ mt:2 }}>

                        The user will not be able to sign in
                        until the account is activated again.

                    </DialogContentText>

                )}

            </DialogContent>

            <DialogActions>

                <Button

                    disabled={loading}

                    onClick={onClose}

                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    color={
                        activate
                            ? "success"
                            : "warning"
                    }

                    disabled={loading}

                    onClick={handleConfirm}

                    startIcon={
                        loading
                            ? <CircularProgress size={18}/>
                            : null
                    }

                >

                    {activate
                        ? "Activate"
                        : "Deactivate"}

                </Button>

            </DialogActions>

        </Dialog>

    );

}
