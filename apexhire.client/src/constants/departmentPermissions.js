export const DEPARTMENT_PERMISSIONS={

    VIEW:"department.view",

    CREATE:"department.create",

    UPDATE:"department.update",

    DELETE:"department.delete",

    RESTORE:"department.restore",

    EXPORT:"department.export"

};

export const SYSTEM_ROLES={

    ADMINISTRATOR:"Administrator",

    RECRUITER:"Recruiter",

    HIRING_MANAGER:"HiringManager",

    CANDIDATE:"Candidate"

};

export const ROLE_PERMISSIONS={

    Administrator:[

        DEPARTMENT_PERMISSIONS.VIEW,

        DEPARTMENT_PERMISSIONS.CREATE,

        DEPARTMENT_PERMISSIONS.UPDATE,

        DEPARTMENT_PERMISSIONS.DELETE,

        DEPARTMENT_PERMISSIONS.RESTORE,

        DEPARTMENT_PERMISSIONS.EXPORT

    ],

    Recruiter:[

        DEPARTMENT_PERMISSIONS.VIEW

    ],

    HiringManager:[

        DEPARTMENT_PERMISSIONS.VIEW

    ],

    Candidate:[]

};


export function hasDepartmentPermission(

    user,

    permission

){

    if(

        !user

    ){

        return false;

    }

    const permissions=

        ROLE_PERMISSIONS[

            user.role

        ]??

        [];

    return permissions.includes(

        permission

    );

}

export const canViewDepartments=user=>

    hasDepartmentPermission(

        user,

        DEPARTMENT_PERMISSIONS.VIEW

    );

export const canCreateDepartment=user=>

    hasDepartmentPermission(

        user,

        DEPARTMENT_PERMISSIONS.CREATE

    );

export const canUpdateDepartment=user=>

    hasDepartmentPermission(

        user,

        DEPARTMENT_PERMISSIONS.UPDATE

    );

export const canDeleteDepartment=user=>

    hasDepartmentPermission(

        user,

        DEPARTMENT_PERMISSIONS.DELETE

    );

export const canRestoreDepartment=user=>

    hasDepartmentPermission(

        user,

        DEPARTMENT_PERMISSIONS.RESTORE

    );

export const canExportDepartments=user=>

    hasDepartmentPermission(

        user,

        DEPARTMENT_PERMISSIONS.EXPORT

    );


export default{

    DEPARTMENT_PERMISSIONS,

    SYSTEM_ROLES,

    ROLE_PERMISSIONS,

    hasDepartmentPermission,

    canViewDepartments,

    canCreateDepartment,

    canUpdateDepartment,

    canDeleteDepartment,

    canRestoreDepartment,

    canExportDepartments

};

