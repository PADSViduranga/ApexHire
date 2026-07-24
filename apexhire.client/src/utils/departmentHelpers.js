export function formatDepartmentDate(

    value

){

    if(

        !value

    ){

        return "-";

    }

    return new Date(

        value

    ).toLocaleDateString();

}

export function formatDepartmentStatus(

    isActive

){

    return isActive

        ?"Active"

        :"Inactive";

}

export function getDepartmentInitials(

    name

){

    if(

        !name

    ){

        return "DP";

    }

    return name

        .trim()

        .split(" ")

        .filter(Boolean)

        .slice(0,2)

        .map(

            word=>word[0]

        )

        .join("")

        .toUpperCase();

}

export function normalizeDepartment(

    department

){

    if(

        !department

    ){

        return null;

    }

    return{

        ...department

    };

}


export function normalizeDepartments(

    departments

){

    return(

        departments??

        []

    ).map(

        normalizeDepartment

    );

}

export function buildDepartmentQuery(

    filters

){

    return{

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

                :filters.status

    };

}

export function hasDepartmentChanges(

    original,

    current

){

    return JSON.stringify(

        original

    )!==JSON.stringify(

        current

    );

}

export function sortDepartments(

    departments,

    field,

    descending=false

){

    return[

        ...departments

    ].sort(

        (

            left,

            right

        )=>{

            const a=

                left?.[field];

            const b=

                right?.[field];

            if(

                a===b

            ){

                return 0;

            }

            if(

                a>b

            ){

                return descending

                    ?-1

                    :1;

            }

            return descending

                ?1

                :-1;

        }

    );

}


export function createDepartmentPayload(

    values

){

    return{

        name:

            values.name?.trim(),

        code:

            values.code?.trim(),

        organizationId:

            Number(

                values.organizationId

            ),

        email:

            values.email?.trim()||

            null,

        phoneNumber:

            values.phoneNumber?.trim()||

            null,

        managerName:

            values.managerName?.trim()||

            null,

        location:

            values.location?.trim()||

            null,

        description:

            values.description?.trim()||

            null,

        isActive:

            Boolean(

                values.isActive

            )

    };

}

export function isDepartmentActive(

    department

){

    return Boolean(

        department?.isActive

    );

}

export default{

    formatDepartmentDate,

    formatDepartmentStatus,

    getDepartmentInitials,

    normalizeDepartment,

    normalizeDepartments,

    buildDepartmentQuery,

    hasDepartmentChanges,

    sortDepartments,

    createDepartmentPayload,

    isDepartmentActive

};

