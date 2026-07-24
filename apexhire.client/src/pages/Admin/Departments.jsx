import {

    Add,

    Refresh

} from "@mui/icons-material";

import {

    Alert,

    Box,

    Button,

    CircularProgress,

    Container,

    Stack,

    Typography

} from "@mui/material";

import {

    useDepartments

} from "../../hooks/useDepartments";

import {

    DepartmentToolbar,

    DepartmentTable,

    DepartmentStatsCards,

    DepartmentFormDialog,

    DeleteDepartmentDialog,

    DepartmentDetailsDialog,

    EmptyDepartments

} from "../../components/Admin/departments";

export default function Departments(){

    const{

        loading,

        departments,

        organizations,

        statistics,

        filters,

        dialogs,

        validation,

        fetchDepartments,

        createDepartment,

        updateDepartment,

        deleteDepartment

    }=useDepartments();


    if(

        loading.initial

    ){

        return(

            <Box

                display="flex"

                justifyContent="center"

                alignItems="center"

                minHeight="60vh"

            >

                <CircularProgress/>

            </Box>

        );

    }

    return(

        <Container

            maxWidth="xl"

            sx={{

                py:4

            }}

        >

            <Stack

                spacing={3}

            >

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                >

                    <Typography

                        variant="h4"

                        fontWeight={700}

                    >

                        Departments

                    </Typography>

                    <Stack

                        direction="row"

                        spacing={2}

                    >

                        <Button

                            variant="outlined"

                            startIcon={<Refresh/>}

                            onClick={

                                fetchDepartments

                            }

                        >

                            Refresh

                        </Button>

                        <Button

                            variant="contained"

                            startIcon={<Add/>}

                            onClick={

                                dialogs.openCreateDialog

                            }

                        >

                            New Department

                        </Button>

                    </Stack>

                </Stack>

                {

                    validation.error && (

                        <Alert

                            severity="error"

                        >

                            {

                                validation.error

                            }

                        </Alert>

                    )

                }

                <DepartmentStatsCards

                    statistics={

                        statistics

                    }

                />


                <DepartmentToolbar

                    filters={filters}

                    organizations={organizations}

                />

                {

                    departments.length===0 ? (

                        <EmptyDepartments

                            onCreate={

                                dialogs.openCreateDialog

                            }

                        />

                    ) : (

                        <DepartmentTable

                            rows={departments}

                            loading={loading.table}

                            rowCount={

                                filters.totalRows

                            }

                            page={

                                filters.page

                            }

                            pageSize={

                                filters.pageSize

                            }

                            sortModel={

                                filters.sortModel

                            }

                            onPageChange={

                                filters.setPage

                            }

                            onPageSizeChange={

                                filters.setPageSize

                            }

                            onSortModelChange={

                                filters.setSortModel

                            }

                            onView={

                                dialogs.openViewDialog

                            }

                            onEdit={

                                dialogs.openEditDialog

                            }

                            onDelete={

                                dialogs.openDeleteDialog

                            }

                        />

                    )

                }


                <DepartmentFormDialog

                    open={dialogs.form.open}

                    editMode={dialogs.form.editMode}

                    department={dialogs.form.department}

                    organizations={organizations}

                    errors={validation.errors}

                    validating={loading.saving}

                    onSubmit={values=>

                        dialogs.form.editMode

                            ?updateDepartment(values)

                            :createDepartment(values)

                    }

                    onClose={

                        dialogs.closeFormDialog

                    }

                    clearError={

                        validation.clearError

                    }

                />

                <DeleteDepartmentDialog

                    open={dialogs.delete.open}

                    department={dialogs.delete.department}

                    deleting={loading.deleting}

                    onConfirm={deleteDepartment}

                    onClose={

                        dialogs.closeDeleteDialog

                    }

                />

                <DepartmentDetailsDialog

                    open={dialogs.details.open}

                    department={

                        dialogs.details.department

                    }

                    onClose={

                        dialogs.closeDetailsDialog

                    }

                />

            </Stack>

        </Container>

    );

}

