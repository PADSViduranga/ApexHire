import {
    MoreVert
} from "@mui/icons-material";

import {
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";

import {
    DataGrid,
    GridToolbar,
    GridOverlay
} from "@mui/x-data-grid";

import {
    useMemo,
    useState
} from "react";

function EmptyOverlay(){

    return(

        <GridOverlay>

            <Stack
                height="100%"
                alignItems="center"
                justifyContent="center"
                spacing={1}
            >

                <Typography
                    variant="h6"
                    color="text.secondary"
                >

                    No users found

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Try changing your filters.

                </Typography>

            </Stack>

        </GridOverlay>

    );

}

export default function UserTable({

    rows,

    loading,

    totalRows,

    page,

    pageSize,

    sortModel,

    onPageChange,

    onPageSizeChange,

    onSortModelChange,

    onEdit,

    onDelete,

    onResetPassword,

    onToggleStatus

}){

    const [

        anchorEl,

        setAnchorEl

    ]=useState(null);

    const [

        selectedRow,

        setSelectedRow

    ]=useState(null);

    const menuOpen=Boolean(anchorEl);

    function openMenu(

        event,

        row

    ){

        setAnchorEl(

            event.currentTarget

        );

        setSelectedRow(

            row

        );

    }

    function closeMenu(){

        setAnchorEl(null);

        setSelectedRow(null);

    }


    const columns=useMemo(

        ()=>[

            {

                field:"id",

                headerName:"ID",

                width:90,

                sortable:true

            },

            {

                field:"fullName",

                headerName:"Full Name",

                flex:1.4,

                minWidth:220,

                sortable:true,

                renderCell:(params)=>(

                    <Stack
                        justifyContent="center"
                        height="100%"
                    >

                        <Typography
                            fontWeight={600}
                        >

                            {params.row.fullName}

                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            {params.row.email}

                        </Typography>

                    </Stack>

                )

            },

            {

                field:"role",

                headerName:"Role",

                width:150,

                sortable:true,

                renderCell:(params)=>(

                    <Chip

                        label={params.value}

                        color={

                            params.value==="Administrator"

                                ?"error"

                            :params.value==="Recruiter"

                                ?"primary"

                            :params.value==="HiringManager"

                                ?"warning"

                                :"success"

                        }

                        variant="outlined"

                        size="small"

                    />

                )

            },

            {

                field:"organization",

                headerName:"Organization",

                flex:1,

                minWidth:180

            },

            {

                field:"department",

                headerName:"Department",

                flex:1,

                minWidth:170

            },

            {

                field:"status",

                headerName:"Status",

                width:140,

                sortable:true,

                renderCell:(params)=>(

                    <Chip

                        label={

                            params.value

                                ?"Active"

                                :"Inactive"

                        }

                        color={

                            params.value

                                ?"success"

                                :"default"

                        }

                        size="small"

                    />

                )

            },

            {

                field:"createdAt",

                headerName:"Created",

                width:180,

                sortable:true,

                valueFormatter:(value)=>{

                    if(!value){

                        return "";

                    }

                    return new Date(value).toLocaleString();

                }

            },


            {

                field:"actions",

                headerName:"Actions",

                width:90,

                sortable:false,

                filterable:false,

                disableColumnMenu:true,

                renderCell:(params)=>(

                    <>

                        <Tooltip title="Actions">

                            <IconButton

                                size="small"

                                onClick={(event)=>

                                    openMenu(

                                        event,

                                        params.row

                                    )

                                }

                            >

                                <MoreVert/>

                            </IconButton>

                        </Tooltip>

                    </>

                )

            }

        ],

        []

    );

    return(

        <>

            <Box
                sx={{

                    width:"100%",

                    height:700,

                    "& .MuiDataGrid-cell:focus":{

                        outline:"none"

                    },

                    "& .MuiDataGrid-columnHeader:focus":{

                        outline:"none"

                    }

                }}

            >

                <DataGrid

                    rows={rows}

                    columns={columns}

                    loading={loading}

                    rowCount={totalRows}

                    paginationMode="server"

                    sortingMode="server"

                    filterMode="server"

                    paginationModel={{

                        page,

                        pageSize

                    }}

                    onPaginationModelChange={(model)=>{

                        if(model.page!==page){

                            onPageChange(model.page);

                        }

                        if(model.pageSize!==pageSize){

                            onPageSizeChange(model.pageSize);

                        }

                    }}

                    sortModel={sortModel}

                    onSortModelChange={onSortModelChange}

                    pageSizeOptions={[

                        10,

                        25,

                        50,

                        100

                    ]}

                    disableRowSelectionOnClick

                    density="comfortable"

                    slots={{

                        toolbar:GridToolbar,

                        noRowsOverlay:EmptyOverlay

                    }}

                />

            </Box>


            <Menu

                anchorEl={anchorEl}

                open={menuOpen}

                onClose={closeMenu}

                transformOrigin={{

                    vertical:"top",

                    horizontal:"right"

                }}

                anchorOrigin={{

                    vertical:"bottom",

                    horizontal:"right"

                }}

            >

                <MenuItem

                    onClick={()=>{

                        onEdit(selectedRow);

                        closeMenu();

                    }}

                >

                    Edit User

                </MenuItem>

                <MenuItem

                    onClick={()=>{

                        onResetPassword(selectedRow);

                        closeMenu();

                    }}

                >

                    Reset Password

                </MenuItem>

                <MenuItem

                    onClick={()=>{

                        onToggleStatus(selectedRow);

                        closeMenu();

                    }}

                >

                    {

                        selectedRow?.status

                            ? "Deactivate User"

                            : "Activate User"

                    }

                </MenuItem>

                <MenuItem

                    sx={{

                        color:"error.main"

                    }}

                    onClick={()=>{

                        onDelete(selectedRow);

                        closeMenu();

                    }}

                >

                    Delete User

                </MenuItem>

            </Menu>

        </>

    );

}
