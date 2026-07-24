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

    DepartmentAvatar,

    DepartmentStatusChip

} from "./";

export default function DepartmentTable({

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

            headerName:"Department",

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

                    <DepartmentAvatar

                        department={

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

            field:"organizationName",

            headerName:"Organization",

            flex:1.3,

            minWidth:220

        },

        {

            field:"managerName",

            headerName:"Manager",

            flex:1.2,

            minWidth:180

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

            field:"location",

            headerName:"Location",

            flex:1,

            minWidth:180

        },

        {

            field:"isActive",

            headerName:"Status",

            width:140,

            sortable:false,

            renderCell:params=>(

                <DepartmentStatusChip

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

