import {

    Box,

    Button,

    Stack,

    Typography

} from "@mui/material";

import {

    Apartment,

    Add

} from "@mui/icons-material";

export default function EmptyDepartments({

    onCreate

}){

    return(

        <Box

            sx={{

                py:10,

                textAlign:"center"

            }}

        >

            <Stack

                spacing={2}

                alignItems="center"

            >

                <Apartment

                    color="disabled"

                    sx={{

                        fontSize:72

                    }}

                />

                <Typography

                    variant="h5"

                    fontWeight={700}

                >

                    No departments found

                </Typography>

                <Typography

                    color="text.secondary"

                >

                    Create your first department to organize teams within your organizations.

                </Typography>

                <Button

                    variant="contained"

                    startIcon={<Add/>}

                    onClick={onCreate}

                >

                    Create Department

                </Button>

            </Stack>

        </Box>

    );

}

