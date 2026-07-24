import {

    Box,

    Button,

    Stack,

    Typography

} from "@mui/material";

import {

    Business,

    Add

} from "@mui/icons-material";

export default function EmptyOrganizations({

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

                <Business

                    color="disabled"

                    sx={{

                        fontSize:72

                    }}

                />

                <Typography

                    variant="h5"

                    fontWeight={700}

                >

                    No organizations found

                </Typography>

                <Typography

                    color="text.secondary"

                >

                    Create your first organization to start managing recruiters and job postings.

                </Typography>

                <Button

                    variant="contained"

                    startIcon={<Add/>}

                    onClick={onCreate}

                >

                    Create Organization

                </Button>

            </Stack>

        </Box>

    );

}

