import {

    Button,

    Grid,

    MenuItem,

    Paper,

    Stack,

    TextField

} from "@mui/material";

import {

    Add,

    Refresh

} from "@mui/icons-material";

import {

    ORGANIZATION_STATUS_OPTIONS

} from "../../../utils/organizationConstants";

export default function OrganizationToolbar({

    filters,

    onFilterChange,

    onCreate,

    onRefresh

}){

    return(

        <Paper

            sx={{

                p:2,

                mb:3

            }}

        >

            <Grid

                container

                spacing={2}

                alignItems="center"

            >

                <Grid

                    item

                    xs={12}

                    md={4}

                >

                    <TextField

                        fullWidth

                        label="Search"

                        placeholder="Search organizations..."

                        value={

                            filters.search

                        }

                        onChange={event=>

                            onFilterChange({

                                search:event.target.value

                            })

                        }

                    />

                </Grid>


                <Grid

                    item

                    xs={12}

                    md={3}

                >

                    <TextField

                        select

                        fullWidth

                        label="Status"

                        value={

                            filters.status

                        }

                        onChange={event=>

                            onFilterChange({

                                status:event.target.value

                            })

                        }

                    >

                        {

                            ORGANIZATION_STATUS_OPTIONS.map(

                                option=>(

                                    <MenuItem

                                        key={option.value}

                                        value={option.value}

                                    >

                                        {option.label}

                                    </MenuItem>

                                )

                            )

                        }

                    </TextField>

                </Grid>

                <Grid

                    item

                    xs={12}

                    md={5}

                >

                    <Stack

                        direction="row"

                        spacing={2}

                        justifyContent="flex-end"

                    >

                        <Button

                            startIcon={<Refresh/>}

                            onClick={onRefresh}

                        >

                            Refresh

                        </Button>

                        <Button

                            variant="contained"

                            startIcon={<Add/>}

                            onClick={onCreate}

                        >

                            New Organization

                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Paper>

    );

}

