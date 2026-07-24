import {

    Button,

    Dialog,

    DialogActions,

    DialogContent,

    DialogTitle,

    Typography

} from "@mui/material";

export default function DeleteOrganizationDialog({

    open,

    organization,

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

                Delete Organization

            </DialogTitle>

            <DialogContent>

                <Typography>

                    Are you sure you want to delete

                    <strong>

                        {" "}

                        {organization?.name}

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

                >

                    Cancel

                </Button>

                <Button

                    color="error"

                    variant="contained"

                    disabled={deleting}

                    onClick={

                        ()=>onConfirm(

                            organization

                        )

                    }

                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

}

