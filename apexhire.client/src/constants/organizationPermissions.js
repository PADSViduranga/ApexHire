export const ORGANIZATION_PERMISSIONS={

    VIEW:

        "organizations.view",

    CREATE:

        "organizations.create",

    UPDATE:

        "organizations.update",

    DELETE:

        "organizations.delete",

    RESTORE:

        "organizations.restore",

    EXPORT:

        "organizations.export",

    VIEW_STATISTICS:

        "organizations.view.statistics",

    ASSIGN_RECRUITER:

        "organizations.assign.recruiter",

    REMOVE_RECRUITER:

        "organizations.remove.recruiter",

    ASSIGN_HIRING_MANAGER:

        "organizations.assign.hiringmanager",

    REMOVE_HIRING_MANAGER:

        "organizations.remove.hiringmanager"

};

export const SYSTEM_ROLES={

    ADMINISTRATOR:"Administrator",

    RECRUITER:"Recruiter",

    HIRING_MANAGER:"HiringManager",

    CANDIDATE:"Candidate"

};

export const ROLE_PERMISSIONS={

    Administrator:Object.values(

        ORGANIZATION_PERMISSIONS

    ),

    Recruiter:[

        ORGANIZATION_PERMISSIONS.VIEW

    ],

    HiringManager:[

        ORGANIZATION_PERMISSIONS.VIEW

    ],

    Candidate:[]

};


export function hasOrganizationPermission(

    user,

    permission

){

    if(

        !user

    ){

        return false;

    }

    if(

        Array.isArray(

            user.permissions

        )

    ){

        return user.permissions.includes(

            permission

        );

    }

    const role=

        user.role??

        "Candidate";

    return (

        ROLE_PERMISSIONS[role]??

        []

    ).includes(

        permission

    );

}

export function canViewOrganizations(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.VIEW

    );

}

export function canCreateOrganization(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.CREATE

    );

}

export function canUpdateOrganization(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.UPDATE

    );

}

export function canDeleteOrganization(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.DELETE

    );

}

export function canRestoreOrganization(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.RESTORE

    );

}

export function canExportOrganizations(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.EXPORT

    );

}



export function canViewOrganizationStatistics(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.VIEW_STATISTICS

    );

}

export function canAssignRecruiter(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.ASSIGN_RECRUITER

    );

}

export function canRemoveRecruiter(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.REMOVE_RECRUITER

    );

}

export function canAssignHiringManager(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.ASSIGN_HIRING_MANAGER

    );

}

export function canRemoveHiringManager(

    user

){

    return hasOrganizationPermission(

        user,

        ORGANIZATION_PERMISSIONS.REMOVE_HIRING_MANAGER

    );

}

export default{

    ORGANIZATION_PERMISSIONS,

    SYSTEM_ROLES,

    ROLE_PERMISSIONS,

    hasOrganizationPermission,

    canViewOrganizations,

    canCreateOrganization,

    canUpdateOrganization,

    canDeleteOrganization,

    canRestoreOrganization,

    canExportOrganizations,

    canViewOrganizationStatistics,

    canAssignRecruiter,

    canRemoveRecruiter,

    canAssignHiringManager,

    canRemoveHiringManager

};

