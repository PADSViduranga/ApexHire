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

    DEPARTMENT_STATUS_OPTIONS

} from "../../../utils/departmentConstants";

export default function DepartmentToolbar({

    filters,

    organizations,

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

                        placeholder="Search departments..."

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

                        label="Organization"

                        value={

                            filters.organizationId

                        }

                        onChange={event=>

                            onFilterChange({

                                organizationId:event.target.value

                            })

                        }

                    >

                        <MenuItem value="">

                            All Organizations

                        </MenuItem>

                        {

                            organizations.map(

                                organization=>(

                                    <MenuItem

                                        key={organization.id}

                                        value={organization.id}

                                    >

                                        {organization.name}

                                    </MenuItem>

                                )

                            )

                        }

                    </TextField>

                </Grid>


                <Grid

                    item

                    xs={12}

                    md={2}

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

                            DEPARTMENT_STATUS_OPTIONS.map(

                                option=>(

                                    <MenuItem

                                        key={String(option.value)}

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

                    md={3}

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

                            New Department

                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Paper>

    );

}

