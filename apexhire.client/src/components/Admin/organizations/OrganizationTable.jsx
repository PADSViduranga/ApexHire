import {

    DataGrid,

    GridActionsCellItem

} from "@mui/x-data-grid";

import {

    Edit,

    Delete,

    Visibility

} from "@mui/icons-material";

import {

    OrganizationAvatar,

    OrganizationStatusChip

} from "./";

export default function OrganizationTable({

    rows,

    loading,

    rowCount,

    page,

    pageSize,

    sortModel,

    onPageChange,

    onPageSizeChange,

    onSortModelChange,

    onEdit,

    onDelete,

    onView

}){

    const columns=[

        {

            field:"name",

            headerName:"Organization",

            flex:1.5,

            minWidth:240,

            renderCell:params=>(

                <div

                    style={{

                        display:"flex",

                        alignItems:"center",

                        gap:12,

                        height:"100%"

                    }}

                >

                    <OrganizationAvatar

                        organization={

                            params.row

                        }

                    />

                    <span>

                        {params.row.name}

                    </span>

                </div>

            )

        },

        {

            field:"email",

            headerName:"Email",

            flex:1.3,

            minWidth:220

        },

        {

            field:"phoneNumber",

            headerName:"Phone",

            flex:1,

            minWidth:150

        },


        {

            field:"city",

            headerName:"City",

            flex:1,

            minWidth:140

        },

        {

            field:"country",

            headerName:"Country",

            flex:1,

            minWidth:140

        },

        {

            field:"isActive",

            headerName:"Status",

            width:140,

            sortable:false,

            renderCell:params=>(

                <OrganizationStatusChip

                    active={

                        params.row.isActive

                    }

                />

            )

        },

        {

            field:"actions",

            type:"actions",

            width:120,

            getActions:params=>[

                <GridActionsCellItem

                    key="view"

                    icon={<Visibility/>}

                    label="View"

                    onClick={()=>

                        onView(

                            params.row

                        )

                    }

                />,

                <GridActionsCellItem

                    key="edit"

                    icon={<Edit/>}

                    label="Edit"

                    onClick={()=>

                        onEdit(

                            params.row

                        )

                    }

                />,

                <GridActionsCellItem

                    key="delete"

                    icon={<Delete/>}

                    label="Delete"

                    onClick={()=>

                        onDelete(

                            params.row

                        )

                    }

                    showInMenu

                />

            ]

        }

    ];


    return(

        <DataGrid

            rows={rows}

            columns={columns}

            loading={loading}

            getRowId={row=>row.id}

            rowCount={rowCount}

            paginationMode="server"

            sortingMode="server"

            pagination

            page={page}

            pageSize={pageSize}

            onPageChange={onPageChange}

            onPageSizeChange={onPageSizeChange}

            sortModel={sortModel}

            onSortModelChange={onSortModelChange}

            rowsPerPageOptions={[

                10,

                25,

                50,

                100

            ]}

            disableRowSelectionOnClick

            autoHeight

        />

    );

}

