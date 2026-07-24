import {
    Add,
    Clear,
    Refresh,
    Search
} from "@mui/icons-material";

import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

const roleOptions=[

    {
        value:"",
        label:"All Roles"
    },

    {
        value:"Candidate",
        label:"Candidate"
    },

    {
        value:"Recruiter",
        label:"Recruiter"
    },

    {
        value:"HiringManager",
        label:"Hiring Manager"
    },

    {
        value:"Administrator",
        label:"Administrator"
    }

];

const statusOptions=[

    {
        value:"",
        label:"All Status"
    },

    {
        value:true,
        label:"Active"
    },

    {
        value:false,
        label:"Inactive"
    }

];

export default function UserToolbar({

    filters,

    loading,

    onFilterChange,

    onRefresh,

    onAddUser

}){

    const[

        search,

        setSearch

    ]=useState(

        filters.search??""

    );

    useEffect(

        ()=>{

            setSearch(

                filters.search??""

            );

        },

        [

            filters.search

        ]

    );


    function updateFilter(

        key,

        value

    ){

        onFilterChange({

            ...filters,

            [key]:value

        });

    }

    function clearFilters(){

        setSearch("");

        onFilterChange({

            search:"",

            role:"",

            status:"",

            organizationId:"",

            departmentId:""

        });

    }

    useEffect(

        ()=>{

            const timeout=setTimeout(

                ()=>{

                    if(

                        search!==filters.search

                    ){

                        updateFilter(

                            "search",

                            search

                        );

                    }

                },

                500

            );

            return()=>clearTimeout(

                timeout

            );

        },

        [

            search

        ]

    );

    return(

        <Box

            sx={{

                mb:3,

                p:2,

                borderRadius:2,

                bgcolor:"background.paper",

                border:1,

                borderColor:"divider"

            }}

        >

            <Grid

                container

                spacing={2}

                alignItems="center"

            >

                <Grid
                    size={{
                        xs:12,
                        md:4
                    }}
                >

                    <TextField

                        fullWidth

                        placeholder="Search users..."

                        value={search}

                        onChange={(e)=>

                            setSearch(

                                e.target.value

                            )

                        }

                        InputProps={{

                            startAdornment:(

                                <InputAdornment position="start">

                                    <Search/>

                                </InputAdornment>

                            )

                        }}

                    />

                </Grid>

                <Grid
                    size={{
                        xs:12,
                        sm:6,
                        md:2
                    }}
                >

                    <FormControl fullWidth>

                        <TextField

                            select

                            label="Role"

                            value={

                                filters.role??""

                            }

                            onChange={(e)=>

                                updateFilter(

                                    "role",

                                    e.target.value

                                )

                            }

                        >

                            {

                                roleOptions.map(

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

                    </FormControl>

                </Grid>

                <Grid
                    size={{
                        xs:12,
                        sm:6,
                        md:2
                    }}
                >

                    <FormControl fullWidth>

                        <TextField

                            select

                            label="Status"

                            value={

                                filters.status??""

                            }

                            onChange={(e)=>

                                updateFilter(

                                    "status",

                                    e.target.value

                                )

                            }

                        >

                            {

                                statusOptions.map(

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

                    </FormControl>

                </Grid>


                <Grid
                    size={{
                        xs:12,
                        md:4
                    }}
                >

                    <Stack

                        direction="row"

                        spacing={1}

                        justifyContent="flex-end"

                        flexWrap="wrap"

                    >

                        <Tooltip title="Refresh Users">

                            <span>

                                <IconButton

                                    color="primary"

                                    onClick={onRefresh}

                                    disabled={loading}

                                >

                                    <Refresh/>

                                </IconButton>

                            </span>

                        </Tooltip>

                        <Tooltip title="Clear Filters">

                            <span>

                                <IconButton

                                    color="default"

                                    onClick={clearFilters}

                                    disabled={loading}

                                >

                                    <Clear/>

                                </IconButton>

                            </span>

                        </Tooltip>

                        <Button

                            variant="contained"

                            startIcon={<Add/>}

                            onClick={onAddUser}

                            disabled={loading}

                        >

                            Add User

                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Box>

    );

}
