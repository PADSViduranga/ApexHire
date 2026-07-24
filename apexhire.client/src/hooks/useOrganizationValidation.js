import {

    useCallback,

    useState

} from "react";

import {

    validateOrganization

} from "../validation/organizationSchema";

export default function useOrganizationValidation(){

    const[

        errors,

        setErrors

    ]=useState({});

    const[

        validating,

        setValidating

    ]=useState(

        false

    );

    const clearErrors=useCallback(

        ()=>{

            setErrors({});

        },

        []

    );

    const clearError=useCallback(

        field=>{

            setErrors(

                previous=>{

                    if(

                        !previous[field]

                    ){

                        return previous;

                    }

                    const next={

                        ...previous

                    };

                    delete next[field];

                    return next;

                }

            );

        },

        []

    );


    const validate=useCallback(

        async values=>{

            setValidating(

                true

            );

            const result=

                await validateOrganization(

                    values

                );

            setValidating(

                false

            );

            if(

                result.isValid

            ){

                setErrors({});

                return{

                    isValid:true,

                    errors:{}

                };

            }

            setErrors(

                result.errors

            );

            return{

                isValid:false,

                errors:

                    result.errors

            };

        },

        []

    );

    const setFieldError=useCallback(

        (

            field,

            message

        )=>{

            setErrors(

                previous=>({

                    ...previous,

                    [field]:

                        message

                })

            );

        },

        []

    );


    return{

        errors,

        validating,

        validate,

        clearErrors,

        clearError,

        setFieldError,

        setErrors

    };

}

