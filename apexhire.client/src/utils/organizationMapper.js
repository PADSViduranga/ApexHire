export function mapOrganizationFromApi(

    organization={}

){

    return{

        id:

            organization.id??

            0,

        name:

            organization.name??

            "",

        code:

            organization.code??

            "",

        email:

            organization.email??

            "",

        phoneNumber:

            organization.phoneNumber??

            "",

        website:

            organization.website??

            "",

        address:

            organization.address??

            "",

        city:

            organization.city??

            "",

        country:

            organization.country??

            "",

        description:

            organization.description??

            "",

        isActive:

            organization.isActive??

            true,

        createdAt:

            organization.createdAt??

            null,

        updatedAt:

            organization.updatedAt??

            null,

        recruiterCount:

            organization.recruiterCount??

            0,

        hiringManagerCount:

            organization.hiringManagerCount??

            0,

        departmentCount:

            organization.departmentCount??

            0,

        jobCount:

            organization.jobCount??

            0

    };

}

export function mapOrganizationsFromApi(

    organizations=[]

){

    return organizations.map(

        mapOrganizationFromApi

    );

}


export function mapOrganizationToCreateRequest(

    values

){

    return{

        name:

            values.name.trim(),

        code:

            values.code.trim(),

        email:

            values.email.trim(),

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

export function mapOrganizationToUpdateRequest(

    values

){

    return{

        id:

            values.id,

        name:

            values.name.trim(),

        code:

            values.code.trim(),

        email:

            values.email.trim(),

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

export function mapOrganizationSummary(

    organization

){

    return{

        id:

            organization.id,

        name:

            organization.name,

        code:

            organization.code,

        status:

            organization.isActive,

        departments:

            organization.departmentCount,

        recruiters:

            organization.recruiterCount,

        hiringManagers:

            organization.hiringManagerCount,

        jobs:

            organization.jobCount

    };

}


export function mapOrganizationDetails(

    organization

){

    return{

        ...mapOrganizationFromApi(

            organization

        ),

        recruiters:

            organization.recruiters??

            [],

        hiringManagers:

            organization.hiringManagers??

            [],

        departments:

            organization.departments??

            [],

        jobs:

            organization.jobs??

            [],

        createdBy:

            organization.createdBy??

            null,

        updatedBy:

            organization.updatedBy??

            null,

        createdAt:

            organization.createdAt??

            null,

        updatedAt:

            organization.updatedAt??

            null

    };

}

export function mapOrganizationStatistics(

    statistics={}

){

    return{

        totalOrganizations:

            statistics.totalOrganizations??

            0,

        activeOrganizations:

            statistics.activeOrganizations??

            0,

        inactiveOrganizations:

            statistics.inactiveOrganizations??

            0,

        totalDepartments:

            statistics.totalDepartments??

            0,

        totalRecruiters:

            statistics.totalRecruiters??

            0,

        totalHiringManagers:

            statistics.totalHiringManagers??

            0,

        totalJobs:

            statistics.totalJobs??

            0

    };

}

export default{

    mapOrganizationFromApi,

    mapOrganizationsFromApi,

    mapOrganizationToCreateRequest,

    mapOrganizationToUpdateRequest,

    mapOrganizationSummary,

    mapOrganizationDetails,

    mapOrganizationStatistics

};

