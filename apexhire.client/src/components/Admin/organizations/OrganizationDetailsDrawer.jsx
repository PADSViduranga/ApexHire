import {

    Box,

    Divider,

    Drawer,

    Stack,

    Typography

} from "@mui/material";

import {

    Business,

    Email,

    Phone,

    Public,

    LocationOn

} from "@mui/icons-material";

import OrganizationAvatar from "./OrganizationAvatar";

import OrganizationStatusChip from "./OrganizationStatusChip";

export default function OrganizationDetailsDrawer({

    open,

    organization,

    onClose

}){

    if(

        !organization

    ){

        return null;

    }

    return(

        <Drawer

            anchor="right"

            open={open}

            onClose={onClose}

        >

            <Box

                sx={{

                    width:420,

                    p:3

                }}

            >

                <Stack

                    direction="row"

                    spacing={2}

                    alignItems="center"

                >

                    <OrganizationAvatar

                        organization={organization}

                        size={64}

                    />

                    <Box>

                        <Typography

                            variant="h5"

                            fontWeight={700}

                        >

                            {organization.name}

                        </Typography>

                        <OrganizationStatusChip

                            active={organization.isActive}

                        />

                    </Box>

                </Stack>

                <Divider

                    sx={{

                        my:3

                    }}

                />



                <Stack

                    spacing={2}

                >

                    <Stack

                        direction="row"

                        spacing={2}

                        alignItems="center"

                    >

                        <Business

                            color="action"

                        />

                        <Typography>

                            {organization.code}

                        </Typography>

                    </Stack>

                    <Stack

                        direction="row"

                        spacing={2}

                        alignItems="center"

                    >

                        <Email

                            color="action"

                        />

                        <Typography>

                            {

                                organization.email||

                                "-"

                            }

                        </Typography>

                    </Stack>

                    <Stack

                        direction="row"

                        spacing={2}

                        alignItems="center"

                    >

                        <Phone

                            color="action"

                        />

                        <Typography>

                            {

                                organization.phoneNumber||

                                "-"

                            }

                        </Typography>

                    </Stack>

                    <Stack

                        direction="row"

                        spacing={2}

                        alignItems="center"

                    >

                        <Public

                            color="action"

                        />

                        <Typography>

                            {

                                organization.website||

                                "-"

                            }

                        </Typography>

                    </Stack>

                    <Stack

                        direction="row"

                        spacing={2}

                        alignItems="flex-start"

                    >

                        <LocationOn

                            color="action"

                        />

                        <Typography>

                            {

                                organization.address||

                                "-"

                            }

                        </Typography>

                    </Stack>

                </Stack>

                <Divider

                    sx={{

                        my:3

                    }}

                />


                <Typography

                    variant="h6"

                    fontWeight={700}

                    gutterBottom

                >

                    Description

                </Typography>

                <Typography

                    color="text.secondary"

                    paragraph

                >

                    {

                        organization.description||

                        "No description available."

                    }

                </Typography>

                <Divider

                    sx={{

                        my:3

                    }}

                />

                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    City: {

                        organization.city||

                        "-"

                    }

                </Typography>

                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    Country: {

                        organization.country||

                        "-"

                    }

                </Typography>

            </Box>

        </Drawer>

    );

}

