export const DEPARTMENT_STATUS={

    ACTIVE:"Active",

    INACTIVE:"Inactive"

};

export const DEPARTMENT_STATUS_OPTIONS=[

    {

        label:"All",

        value:""

    },

    {

        label:"Active",

        value:true

    },

    {

        label:"Inactive",

        value:false

    }

];

export const DEFAULT_DEPARTMENT_FILTERS={

    search:"",

    organizationId:"",

    status:""

};

export const DEFAULT_PAGE_SIZE=10;

export const PAGE_SIZE_OPTIONS=[

    10,

    25,

    50,

    100

];

export const DEFAULT_SORT_MODEL=[

    {

        field:"name",

        sort:"asc"

    }

];


export const DEPARTMENT_EXPORT_FILE_NAME=

    "departments.xlsx";

export const DEPARTMENT_ROLES={

    ADMIN:"Administrator",

    RECRUITER:"Recruiter",

    MANAGER:"Hiring Manager"

};

export const DEPARTMENT_SORT_FIELDS=[

    "name",

    "code",

    "organizationName",

    "managerName",

    "createdAt"

];

export const DEPARTMENT_COLUMNS=[

    "name",

    "code",

    "organizationName",

    "managerName",

    "email",

    "phoneNumber",

    "location",

    "status"

];

export const DEPARTMENT_DIALOG_TYPES={

    CREATE:"create",

    EDIT:"edit",

    DELETE:"delete",

    DETAILS:"details"

};

export const DEPARTMENT_API_ENDPOINTS={

    BASE:"/departments",

    SEARCH:"/departments/search",

    EXPORT:"/departments/export",

    STATISTICS:"/departments/statistics"

};


export const DEPARTMENT_PERMISSIONS={

    VIEW:"department.view",

    CREATE:"department.create",

    UPDATE:"department.update",

    DELETE:"department.delete",

    RESTORE:"department.restore",

    EXPORT:"department.export"

};

export const DEPARTMENT_TABLE_DEFAULT_STATE={

    density:"standard",

    pagination:{

        page:0,

        pageSize:DEFAULT_PAGE_SIZE

    }

};

export const DEPARTMENT_SEARCH_DEBOUNCE=

    500;

export const DEPARTMENT_MAX_DESCRIPTION_LENGTH=

    500;

export const DEPARTMENT_CACHE_KEY=

    "departments";

export const DEPARTMENT_DATE_FORMAT_OPTIONS={

    year:"numeric",

    month:"short",

    day:"2-digit"

};

export const DEPARTMENT_FORM_MODES={

    CREATE:"create",

    EDIT:"edit"

};

export default{

    DEPARTMENT_STATUS,

    DEPARTMENT_STATUS_OPTIONS,

    DEFAULT_DEPARTMENT_FILTERS,

    DEFAULT_PAGE_SIZE,

    PAGE_SIZE_OPTIONS,

    DEFAULT_SORT_MODEL,

    DEPARTMENT_EXPORT_FILE_NAME,

    DEPARTMENT_ROLES,

    DEPARTMENT_SORT_FIELDS,

    DEPARTMENT_COLUMNS,

    DEPARTMENT_DIALOG_TYPES,

    DEPARTMENT_API_ENDPOINTS,

    DEPARTMENT_PERMISSIONS,

    DEPARTMENT_TABLE_DEFAULT_STATE,

    DEPARTMENT_SEARCH_DEBOUNCE,

    DEPARTMENT_MAX_DESCRIPTION_LENGTH,

    DEPARTMENT_CACHE_KEY,

    DEPARTMENT_DATE_FORMAT_OPTIONS,

    DEPARTMENT_FORM_MODES

};

