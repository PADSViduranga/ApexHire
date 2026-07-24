import {

    useCallback,

    useState

} from "react";

const initialDialogs={

    form:false,

    delete:false,

    details:false

};

export default function useOrganizationDialogs(){

    const[

        dialogs,

        setDialogs

    ]=useState(

        initialDialogs

    );

    const[

        selectedOrganization,

        setSelectedOrganization

    ]=useState(

        null

    );

    const[

        editMode,

        setEditMode

    ]=useState(

        false

    );

    const openCreateDialog=useCallback(

        ()=>{

            setSelectedOrganization(

                null

            );

            setEditMode(

                false

            );

            setDialogs(

                previous=>({

                    ...previous,

                    form:true

                })

            );

        },

        []

    );

    const openEditDialog=useCallback(

        organization=>{

            setSelectedOrganization(

                organization

            );

            setEditMode(

                true

            );

            setDialogs(

                previous=>({

                    ...previous,

                    form:true

                })

            );

        },

        []

    );


    const openDeleteDialog=useCallback(

        organization=>{

            setSelectedOrganization(

                organization

            );

            setDialogs(

                previous=>({

                    ...previous,

                    delete:true

                })

            );

        },

        []

    );

    const openDetailsDialog=useCallback(

        organization=>{

            setSelectedOrganization(

                organization

            );

            setDialogs(

                previous=>({

                    ...previous,

                    details:true

                })

            );

        },

        []

    );

    const closeFormDialog=useCallback(

        ()=>{

            setDialogs(

                previous=>({

                    ...previous,

                    form:false

                })

            );

            setSelectedOrganization(

                null

            );

            setEditMode(

                false

            );

        },

        []

    );

    const closeDeleteDialog=useCallback(

        ()=>{

            setDialogs(

                previous=>({

                    ...previous,

                    delete:false

                })

            );

            setSelectedOrganization(

                null

            );

        },

        []

    );

    const closeDetailsDialog=useCallback(

        ()=>{

            setDialogs(

                previous=>({

                    ...previous,

                    details:false

                })

            );

            setSelectedOrganization(

                null

            );

        },

        []

    );


    const closeAllDialogs=useCallback(

        ()=>{

            setDialogs(

                initialDialogs

            );

            setSelectedOrganization(

                null

            );

            setEditMode(

                false

            );

        },

        []

    );

    return{

        dialogs,

        selectedOrganization,

        editMode,

        openCreateDialog,

        openEditDialog,

        openDeleteDialog,

        openDetailsDialog,

        closeFormDialog,

        closeDeleteDialog,

        closeDetailsDialog,

        closeAllDialogs,

        setDialogs,

        setSelectedOrganization,

        setEditMode

    };

}

