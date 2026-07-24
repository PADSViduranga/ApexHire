import {

    ORGANIZATION_DATE_FORMAT_OPTIONS

} from "./organizationConstants";

export function formatOrganizationDate(

    value

){

    if(

        !value

    ){

        return "-";

    }

    const date=new Date(

        value

    );

    if(

        Number.isNaN(

            date.getTime()

        )

    ){

        return "-";

    }

    return date.toLocaleString(

        undefined,

        ORGANIZATION_DATE_FORMAT_OPTIONS

    );

}

export function formatOrganizationStatus(

    isActive

){

    return isActive

        ?"Active"

        :"Inactive";

}

export function getOrganizationInitials(

    name

){

    if(

        !name

    ){

        return "NA";

    }

    return name

        .trim()

        .split(/\s+/)

        .slice(

            0,

            2

        )

        .map(

            word=>word[0]

        )

        .join("")

        .toUpperCase();

}

export function buildOrganizationAddress(

    organization

){

    return [

        organization?.address,

        organization?.city,

        organization?.country

    ]

    .filter(Boolean)

    .join(", ");

}


export function normalizeOrganization(

    organization={}

){

    return{

        id:organization.id??0,

        name:organization.name??"",

        code:organization.code??"",

        email:organization.email??"",

        phoneNumber:organization.phoneNumber??"",

        website:organization.website??"",

        address:organization.address??"",

        city:organization.city??"",

        country:organization.country??"",

        description:organization.description??"",

        isActive:organization.isActive??true,

        createdAt:organization.createdAt??null,

        updatedAt:organization.updatedAt??null

    };

}

export function normalizeOrganizations(

    organizations=[]

){

    return organizations.map(

        normalizeOrganization

    );

}

export function buildOrganizationQuery(

    filters,

    page,

    pageSize,

    sortModel

){

    const sort=sortModel?.[0];

    return{

        pageNumber:page+1,

        pageSize,

        search:

            filters.search?.trim()||

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

}

export function hasOrganizationChanges(

    original,

    current

){

    return JSON.stringify(

        normalizeOrganization(

            original

        )

    )!==JSON.stringify(

        normalizeOrganization(

            current

        )

    );

}


export function sortOrganizations(

    organizations=[],

    field="name",

    direction="asc"

){

    const multiplier=

        direction==="desc"

            ?-1

            :1;

    return [...organizations].sort(

        (

            a,

            b

        )=>{

            const left=

                a?.[field]??"";

            const right=

                b?.[field]??"";

            if(

                typeof left==="string"

            ){

                return left.localeCompare(

                    right,

                    undefined,

                    {

                        sensitivity:"base"

                    }

                )*multiplier;

            }

            if(

                left>right

            ){

                return multiplier;

            }

            if(

                left<right

            ){

                return -multiplier;

            }

            return 0;

        }

    );

}

export function createOrganizationPayload(

    values

){

    return{

        name:values.name.trim(),

        code:values.code.trim(),

        email:values.email.trim(),

        phoneNumber:

            values.phoneNumber?.trim()||

            null,

        website:

            values.website?.trim()||

            null,

        address:

            values.address.trim(),

        city:

            values.city.trim(),

        country:

            values.country.trim(),

        description:

            values.description?.trim()||

            null,

        isActive:

            values.isActive

    };

}

export function isOrganizationActive(

    organization

){

    return Boolean(

        organization?.isActive

    );

}

export default{

    formatOrganizationDate,

    formatOrganizationStatus,

    getOrganizationInitials,

    buildOrganizationAddress,

    normalizeOrganization,

    normalizeOrganizations,

    buildOrganizationQuery,

    hasOrganizationChanges,

    sortOrganizations,

    createOrganizationPayload,

    isOrganizationActive

};

