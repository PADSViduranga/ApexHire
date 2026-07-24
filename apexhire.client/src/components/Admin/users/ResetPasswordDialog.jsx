import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

export default function ResetPasswordDialog({

    open,

    onClose,

    onConfirm,

    user

}) {

    const [password,setPassword]=useState("");

    const [confirmPassword,setConfirmPassword]=useState("");

    const [error,setError]=useState("");

    const [loading,setLoading]=useState(false);

    useEffect(()=>{

        if(open){

            setPassword("");

            setConfirmPassword("");

            setError("");

        }

    },[open]);

    function validate(){

        if(password.length<6){

            setError(
                "Password must contain at least 6 characters."
            );

            return false;

        }

        if(password!==confirmPassword){

            setError(
                "Passwords do not match."
            );

            return false;

        }

        setError("");

        return true;

    }

    async function handleSave(){

        if(!validate())
            return;

        try{

            setLoading(true);

            await onConfirm(password);

        }
        finally{

            setLoading(false);

        }

    }

    return(

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                Reset Password

            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    mt={1}
                >

                    <TextField

                        label="User"

                        value={user?.fullName ?? ""}

                        InputProps={{
                            readOnly:true
                        }}

                    />

                    <TextField

                        label="New Password"

                        type="password"

                        value={password}

                        onChange={(e)=>
                            setPassword(
                                e.target.value
                            )
                        }

                    />

                    <TextField

                        label="Confirm Password"

                        type="password"

                        value={confirmPassword}

                        onChange={(e)=>
                            setConfirmPassword(
                                e.target.value
                            )
                        }

                    />

                    {error && (

                        <Alert severity="error">

                            {error}

                        </Alert>

                    )}

                </Stack>

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

                    disabled={loading}

                    onClick={handleSave}

                    startIcon={
                        loading
                            ? <CircularProgress size={18}/>
                            : null
                    }

                >

                    Reset Password

                </Button>

            </DialogActions>

        </Dialog>

    );

}
