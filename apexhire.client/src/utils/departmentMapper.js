export function mapDepartmentFromApi(

    department

){

    if(

        !department

    ){

        return null;

    }

    return{

        id:

            department.id,

        name:

            department.name??

            "",

        code:

            department.code??

            "",

        organizationId:

            department.organizationId,

        organizationName:

            department.organizationName??

            department.organization?.name??

            "",

        managerName:

            department.managerName??

            "",

        email:

            department.email??

            "",

        phoneNumber:

            department.phoneNumber??

            "",

        location:

            department.location??

            "",

        description:

            department.description??

            "",

        isActive:

            department.isActive,

        createdAt:

            department.createdAt,

        updatedAt:

            department.updatedAt

    };

}

export function mapDepartmentsFromApi(

    departments

){

    return(

        departments??

        []

    ).map(

        mapDepartmentFromApi

    );

}


export function mapDepartmentToCreateRequest(

    department

){

    return{

        name:

            department.name,

        code:

            department.code,

        organizationId:

            Number(

                department.organizationId

            ),

        managerName:

            department.managerName,

        email:

            department.email,

        phoneNumber:

            department.phoneNumber,

        location:

            department.location,

        description:

            department.description,

        isActive:

            department.isActive

    };

}

export function mapDepartmentToUpdateRequest(

    department

){

    return{

        name:

            department.name,

        code:

            department.code,

        organizationId:

            Number(

                department.organizationId

            ),

        managerName:

            department.managerName,

        email:

            department.email,

        phoneNumber:

            department.phoneNumber,

        location:

            department.location,

        description:

            department.description,

        isActive:

            department.isActive

    };

}

export function mapDepartmentSummary(

    department

){

    return{

        id:

            department.id,

        name:

            department.name,

        code:

            department.code,

        organizationName:

            department.organizationName,

        managerName:

            department.managerName,

        isActive:

            department.isActive

    };

}


export function mapDepartmentDetails(

    department

){

    return{

        ...mapDepartmentFromApi(

            department

        ),

        organization:

            department.organization??

            null,

        employeesCount:

            department.employeesCount??

            0,

        createdBy:

            department.createdBy??

            null

    };

}

export function mapDepartmentStatistics(

    statistics

){

    return{

        totalDepartments:

            statistics?.totalDepartments??

            0,

        activeDepartments:

            statistics?.activeDepartments??

            0,

        inactiveDepartments:

            statistics?.inactiveDepartments??

            0,

        totalEmployees:

            statistics?.totalEmployees??

            0

    };

}

export default{

    mapDepartmentFromApi,

    mapDepartmentsFromApi,

    mapDepartmentToCreateRequest,

    mapDepartmentToUpdateRequest,

    mapDepartmentSummary,

    mapDepartmentDetails,

    mapDepartmentStatistics

};

