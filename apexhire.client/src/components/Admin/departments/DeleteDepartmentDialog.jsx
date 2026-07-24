import {

    Button,

    Dialog,

    DialogActions,

    DialogContent,

    DialogTitle,

    Typography

} from "@mui/material";

export default function DeleteDepartmentDialog({

    open,

    department,

    deleting,

    onConfirm,

    onClose

}){

    return(

        <Dialog

            open={open}

            onClose={onClose}

            maxWidth="sm"

            fullWidth

        >

            <DialogTitle>

                Delete Department

            </DialogTitle>

            <DialogContent>

                <Typography>

                    Are you sure you want to delete

                    <strong>

                        {" "}

                        {department?.name}

                    </strong>

                    ?

                </Typography>

                <Typography

                    variant="body2"

                    color="text.secondary"

                    sx={{

                        mt:2

                    }}

                >

                    This action cannot be undone.

                </Typography>

            </DialogContent>


            <DialogActions>

                <Button

                    onClick={onClose}

                    disabled={deleting}

                >

                    Cancel

                </Button>

                <Button

                    color="error"

                    variant="contained"

                    onClick={onConfirm}

                    disabled={deleting}

                >

                    {

                        deleting

                            ?"Deleting..."

                            :"Delete"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

}


