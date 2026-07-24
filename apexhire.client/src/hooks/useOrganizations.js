import {

    useCallback,

    useEffect,

    useState

} from "react";

import organizationService from "../services/organizationService";

import {

    mapOrganizationsFromApi

} from "../utils/organizationMapper";

export default function useOrganizations(

    query

){

    const[

        organizations,

        setOrganizations

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

    const loadOrganizations=useCallback(

        async()=>{

            try{

                setLoading(

                    true

                );

                setError(

                    ""

                );

                const response=

                    await organizationService.getOrganizations(

                        query

                    );


                const data=

                    response.data??

                    response;

                const items=

                    data.items??

                    data.organizations??

                    data.data??

                    [];

                setOrganizations(

                    mapOrganizationsFromApi(

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

                    "Failed to load organizations."

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

                    await organizationService.getStatistics();

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

                loadOrganizations(),

                loadStatistics()

            ]);

        },

        [

            loadOrganizations,

            loadStatistics

        ]

    );

    useEffect(

        ()=>{

            loadOrganizations();

        },

        [

            loadOrganizations

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

        organizations,

        loading,

        error,

        totalCount,

        statistics,

        setOrganizations,

        setError,

        loadOrganizations,

        loadStatistics,

        refresh

    };

}

