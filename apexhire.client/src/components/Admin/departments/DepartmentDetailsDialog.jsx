import {

    Avatar,

    Chip,

    Dialog,

    DialogContent,

    DialogTitle,

    Divider,

    Grid,

    Stack,

    Typography

} from "@mui/material";

import {

    Business,

    Email,

    LocationOn,

    Person,

    Phone,

    Badge

} from "@mui/icons-material";

import {

    DepartmentStatusChip

} from "./";

export default function DepartmentDetailsDialog({

    open,

    department,

    onClose

}){

    if(

        !department

    ){

        return null;

    }

    return(

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >

            <DialogTitle>

                Department Details

            </DialogTitle>

            <DialogContent>

                <Stack

                    spacing={3}

                >

                    <Stack

                        direction="row"

                        spacing={2}

                        alignItems="center"

                    >

                        <Avatar

                            sx={{

                                width:72,

                                height:72

                            }}

                        >

                            {

                                department.name

                                    ?.substring(

                                        0,

                                        2

                                    )

                                    .toUpperCase()

                            }

                        </Avatar>

                        <Stack>

                            <Typography

                                variant="h5"

                            >

                                {department.name}

                            </Typography>

                            <DepartmentStatusChip

                                active={

                                    department.isActive

                                }

                            />

                        </Stack>

                    </Stack>

                    <Divider/>


                    <Grid

                        container

                        spacing={3}

                    >

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <Stack spacing={2}>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    alignItems="center"

                                >

                                    <Business/>

                                    <Typography>

                                        {

                                            department.organizationName

                                        }

                                    </Typography>

                                </Stack>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    alignItems="center"

                                >

                                    <Badge/>

                                    <Typography>

                                        {

                                            department.code

                                        }

                                    </Typography>

                                </Stack>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    alignItems="center"

                                >

                                    <Person/>

                                    <Typography>

                                        {

                                            department.managerName ||

                                            "Not Assigned"

                                        }

                                    </Typography>

                                </Stack>

                            </Stack>

                        </Grid>

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <Stack spacing={2}>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    alignItems="center"

                                >

                                    <Email/>

                                    <Typography>

                                        {

                                            department.email ||

                                            "-"

                                        }

                                    </Typography>

                                </Stack>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    alignItems="center"

                                >

                                    <Phone/>

                                    <Typography>

                                        {

                                            department.phoneNumber ||

                                            "-"

                                        }

                                    </Typography>

                                </Stack>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    alignItems="center"

                                >

                                    <LocationOn/>

                                    <Typography>

                                        {

                                            department.location ||

                                            "-"

                                        }

                                    </Typography>

                                </Stack>

                            </Stack>

                        </Grid>

                    </Grid>


                    <Divider/>

                    <Typography

                        variant="subtitle1"

                        fontWeight={600}

                    >

                        Description

                    </Typography>

                    <Typography

                        color="text.secondary"

                    >

                        {

                            department.description ||

                            "No description available."

                        }

                    </Typography>

                    <Divider/>

                    <Chip

                        label={

                            `Created: ${

                                department.createdAt ??

                                "-"

                            }`

                        }

                        variant="outlined"

                    />

                </Stack>

            </DialogContent>

        </Dialog>

    );

}

