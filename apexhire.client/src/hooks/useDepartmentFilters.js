import {

    useCallback,

    useMemo,

    useState

} from "react";

import {

    DEFAULT_DEPARTMENT_FILTERS,

    DEFAULT_PAGE_SIZE,

    DEFAULT_SORT_MODEL

} from "../utils/departmentConstants";

export default function useDepartmentFilters(){

    const[

        filters,

        setFilters

    ]=useState(

        DEFAULT_DEPARTMENT_FILTERS

    );

    const[

        page,

        setPage

    ]=useState(

        0

    );

    const[

        pageSize,

        setPageSize

    ]=useState(

        DEFAULT_PAGE_SIZE

    );

    const[

        sortModel,

        setSortModel

    ]=useState(

        DEFAULT_SORT_MODEL

    );

    const updateFilters=useCallback(

        values=>{

            setPage(

                0

            );

            setFilters(

                previous=>({

                    ...previous,

                    ...values

                })

            );

        },

        []

    );


    const clearFilters=useCallback(

        ()=>{

            setFilters(

                DEFAULT_DEPARTMENT_FILTERS

            );

            setPage(

                0

            );

            setSortModel(

                DEFAULT_SORT_MODEL

            );

        },

        []

    );

    const updatePage=useCallback(

        newPage=>{

            setPage(

                newPage

            );

        },

        []

    );

    const updatePageSize=useCallback(

        newPageSize=>{

            setPageSize(

                newPageSize

            );

            setPage(

                0

            );

        },

        []

    );

    const updateSortModel=useCallback(

        model=>{

            setSortModel(

                model?.length

                    ?model

                    :DEFAULT_SORT_MODEL

            );

        },

        []

    );

    const query=useMemo(

        ()=>{

            const sort=

                sortModel?.[0];

            return{

                pageNumber:

                    page+1,

                pageSize,

                search:

                    filters.search?.trim()||

                    undefined,

                organizationId:

                    filters.organizationId||

                    undefined,

                status:

                    filters.status===""||

                    filters.status===undefined

                        ?undefined

                        :filters.status,

                sortBy:

                    sort?.field??

                    "name",

                sortDirection:

                    sort?.sort??

                    "asc"

            };

        },

        [

            filters,

            page,

            pageSize,

            sortModel

        ]

    );


    return{

        filters,

        page,

        pageSize,

        sortModel,

        query,

        setFilters,

        setPage,

        setPageSize,

        setSortModel,

        updateFilters,

        clearFilters,

        updatePage,

        updatePageSize,

        updateSortModel

    };

}

