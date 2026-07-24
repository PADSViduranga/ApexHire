import {

    useCallback,

    useEffect,

    useState

} from "react";

import departmentService from "../services/departmentService";

import {

    mapDepartmentsFromApi

} from "../utils/departmentMapper";

export default function useDepartments(

    query

){

    const[

        departments,

        setDepartments

    ]=useState([]);

    const[

        loading,

        setLoading

    ]=useState(

        true

    );

    const[

        error,

        setError

    ]=useState(

        ""

    );

    const[

        totalCount,

        setTotalCount

    ]=useState(

        0

    );

    const[

        statistics,

        setStatistics

    ]=useState(

        null

    );

    const loadDepartments=useCallback(

        async()=>{

            try{

                setLoading(

                    true

                );

                setError(

                    ""

                );

                const response=

                    await departmentService.getDepartments(

                        query

                    );


                const data=

                    response.data??

                    response;

                const items=

                    data.items??

                    data.departments??

                    data.data??

                    [];

                setDepartments(

                    mapDepartmentsFromApi(

                        items

                    )

                );

                setTotalCount(

                    data.totalCount??

                    data.total??

                    items.length

                );

            }

            catch(ex){

                setError(

                    ex.response?.data?.message??

                    ex.message??

                    "Failed to load departments."

                );

            }

            finally{

                setLoading(

                    false

                );

            }

        },

        [

            query

        ]

    );

    const loadStatistics=useCallback(

        async()=>{

            try{

                const response=

                    await departmentService.getDepartmentStatistics();

                setStatistics(

                    response.data??

                    response

                );

            }

            catch{

                setStatistics(

                    null

                );

            }

        },

        []

    );


    const refresh=useCallback(

        async()=>{

            await Promise.all([

                loadDepartments(),

                loadStatistics()

            ]);

        },

        [

            loadDepartments,

            loadStatistics

        ]

    );

    useEffect(

        ()=>{

            loadDepartments();

        },

        [

            loadDepartments

        ]

    );

    useEffect(

        ()=>{

            loadStatistics();

        },

        [

            loadStatistics

        ]

    );

    return{

        departments,

        loading,

        error,

        totalCount,

        statistics,

        setDepartments,

        setError,

        loadDepartments,

        loadStatistics,

        refresh

    };

}

