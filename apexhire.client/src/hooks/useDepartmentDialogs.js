import {

    useCallback,

    useState

} from "react";

const initialDialogs={

    form:false,

    delete:false,

    details:false

};

export default function useDepartmentDialogs(){

    const[

        dialogs,

        setDialogs

    ]=useState(

        initialDialogs

    );

    const[

        selectedDepartment,

        setSelectedDepartment

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

            setSelectedDepartment(

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

        department=>{

            setSelectedDepartment(

                department

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

        department=>{

            setSelectedDepartment(

                department

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

        department=>{

            setSelectedDepartment(

                department

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

            setSelectedDepartment(

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

            setSelectedDepartment(

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

            setSelectedDepartment(

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

            setSelectedDepartment(

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

        selectedDepartment,

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

        setSelectedDepartment,

        setEditMode

    };

}

