import {

    Alert,

    Box,

    CircularProgress,

    Container,

    Snackbar,

    Typography

} from "@mui/material";

import {

    useState

} from "react";

import {

    DeleteOrganizationDialog,

    EmptyOrganizations,

    OrganizationDetailsDrawer,

    OrganizationFormDialog,

    OrganizationStatsCards,

    OrganizationTable,

    OrganizationToolbar

} from "../../components/Admin/organizations";

import useOrganizations from "../../hooks/useOrganizations";

import useOrganizationDialogs from "../../hooks/useOrganizationDialogs";

import useOrganizationFilters from "../../hooks/useOrganizationFilters";

import useOrganizationValidation from "../../hooks/useOrganizationValidation";

import organizationService from "../../services/organizationService";

export default function Organizations(){

    const[

        snackbar,

        setSnackbar

    ]=useState({

        open:false,

        message:"",

        severity:"success"

    });


    const filters=

        useOrganizationFilters();

    const dialogs=

        useOrganizationDialogs();

    const validation=

        useOrganizationValidation();

    const{

        organizations,

        loading,

        error,

        totalCount,

        statistics,

        refresh

    }=useOrganizations(

        filters.query

    );

    async function handleSubmit(

        values

    ){

        const result=

            await validation.validate(

                values

            );

        if(

            !result.isValid

        ){

            return;

        }

        try{

            if(

                dialogs.editMode

            ){

                await organizationService.updateOrganization(

                    dialogs.selectedOrganization.id,

                    values

                );

                setSnackbar({

                    open:true,

                    severity:"success",

                    message:"Organization updated successfully."

                });

            }

            else{

                await organizationService.createOrganization(

                    values

                );

                setSnackbar({

                    open:true,

                    severity:"success",

                    message:"Organization created successfully."

                });

            }

            dialogs.closeFormDialog();

            refresh();

        }

        catch(ex){

            setSnackbar({

                open:true,

                severity:"error",

                message:

                    ex.response?.data?.message??

                    "Operation failed."

            });

        }

    }


    async function handleDelete(){

        if(

            !dialogs.selectedOrganization

        ){

            return;

        }

        try{

            await organizationService.deleteOrganization(

                dialogs.selectedOrganization.id

            );

            dialogs.closeDeleteDialog();

            refresh();

            setSnackbar({

                open:true,

                severity:"success",

                message:"Organization deleted successfully."

            });

        }

        catch(ex){

            setSnackbar({

                open:true,

                severity:"error",

                message:

                    ex.response?.data?.message??

                    "Delete failed."

            });

        }

    }

    return(

        <Container

            maxWidth="xl"

            sx={{

                py:4

            }}

        >

            <Typography

                variant="h4"

                fontWeight={700}

                gutterBottom

            >

                Organizations

            </Typography>

            <OrganizationStatsCards

                statistics={statistics}

            />

            <OrganizationToolbar

                filters={filters.filters}

                onFilterChange={

                    filters.updateFilters

                }

                onCreate={

                    dialogs.openCreateDialog

                }

                onRefresh={

                    refresh

                }

            />


            {

                loading? (

                    <Box

                        sx={{

                            display:"flex",

                            justifyContent:"center",

                            py:8

                        }}

                    >

                        <CircularProgress/>

                    </Box>

                ):organizations.length===0? (

                    <EmptyOrganizations

                        onCreate={

                            dialogs.openCreateDialog

                        }

                    />

                ): (

                    <OrganizationTable

                        rows={organizations}

                        loading={loading}

                        rowCount={totalCount}

                        page={filters.page}

                        pageSize={filters.pageSize}

                        sortModel={filters.sortModel}

                        onPageChange={filters.updatePage}

                        onPageSizeChange={filters.updatePageSize}

                        onSortModelChange={filters.updateSortModel}

                        onEdit={dialogs.openEditDialog}

                        onDelete={dialogs.openDeleteDialog}

                        onView={dialogs.openDetailsDialog}

                    />

                )

            }

            {

                error&&(

                    <Alert

                        severity="error"

                        sx={{

                            mt:2

                        }}

                    >

                        {error}

                    </Alert>

                )

            }


            <OrganizationFormDialog

                open={dialogs.dialogs.form}

                editMode={dialogs.editMode}

                organization={dialogs.selectedOrganization}

                errors={validation.errors}

                validating={validation.validating}

                onSubmit={handleSubmit}

                onClose={dialogs.closeFormDialog}

                clearError={validation.clearError}

            />

            <DeleteOrganizationDialog

                open={dialogs.dialogs.delete}

                organization={dialogs.selectedOrganization}

                deleting={false}

                onConfirm={handleDelete}

                onClose={dialogs.closeDeleteDialog}

            />

            <OrganizationDetailsDrawer

                open={dialogs.dialogs.details}

                organization={dialogs.selectedOrganization}

                onClose={dialogs.closeDetailsDialog}

            />

            <Snackbar

                open={snackbar.open}

                autoHideDuration={4000}

                onClose={()=>

                    setSnackbar(

                        previous=>({

                            ...previous,

                            open:false

                        })

                    )

                }

            >

                <Alert

                    severity={snackbar.severity}

                    variant="filled"

                    onClose={()=>

                        setSnackbar(

                            previous=>({

                                ...previous,

                                open:false

                            })

                        )

                    }

                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Container>

    );

}

