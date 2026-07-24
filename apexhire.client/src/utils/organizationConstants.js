export const ORGANIZATION_STATUS={

    ACTIVE:true,

    INACTIVE:false

};

export const ORGANIZATION_STATUS_OPTIONS=[

    {

        label:"All Status",

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

export const DEFAULT_ORGANIZATION_FILTERS={

    search:"",

    status:""

};

export const DEFAULT_PAGE_SIZE=25;

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

export const ORGANIZATION_EXPORT_FILE_NAME=

    "organizations.xlsx";


export const ORGANIZATION_ROLES=[

    "Recruiter",

    "HiringManager"

];

export const ORGANIZATION_SORT_FIELDS=[

    {

        label:"Organization Name",

        value:"name"

    },

    {

        label:"Code",

        value:"code"

    },

    {

        label:"Created Date",

        value:"createdAt"

    },

    {

        label:"Updated Date",

        value:"updatedAt"

    }

];

export const ORGANIZATION_COLUMNS=[

    "name",

    "code",

    "email",

    "phoneNumber",

    "website",

    "city",

    "country",

    "status",

    "createdAt",

    "actions"

];

export const ORGANIZATION_DIALOG_TYPES={

    CREATE:"create",

    EDIT:"edit",

    DELETE:"delete",

    DETAILS:"details"

};

export const ORGANIZATION_API_ENDPOINTS={

    BASE:"/api/admin/organizations",

    SEARCH:"/api/admin/organizations/search",

    EXPORT:"/api/admin/organizations/export",

    STATISTICS:"/api/admin/organizations/statistics"

};

export const ORGANIZATION_PERMISSIONS={

    VIEW:"organizations.view",

    CREATE:"organizations.create",

    UPDATE:"organizations.update",

    DELETE:"organizations.delete",

    EXPORT:"organizations.export"

};


export const ORGANIZATION_TABLE_DEFAULT_STATE={

    pagination:{

        paginationModel:{

            page:0,

            pageSize:DEFAULT_PAGE_SIZE

        }

    },

    sorting:{

        sortModel:DEFAULT_SORT_MODEL

    },

    columns:{

        columnVisibilityModel:{

            website:false,

            country:false

        }

    }

};

export const ORGANIZATION_SEARCH_DEBOUNCE=500;

export const ORGANIZATION_MAX_DESCRIPTION_LENGTH=1000;

export const ORGANIZATION_CACHE_KEY="organizations";

export const ORGANIZATION_DATE_FORMAT_OPTIONS={

    year:"numeric",

    month:"short",

    day:"2-digit",

    hour:"2-digit",

    minute:"2-digit"

};

export const ORGANIZATION_FORM_MODES={

    CREATE:"CREATE",

    EDIT:"EDIT"

};

export default{

    ORGANIZATION_STATUS,

    ORGANIZATION_STATUS_OPTIONS,

    DEFAULT_ORGANIZATION_FILTERS,

    DEFAULT_PAGE_SIZE,

    PAGE_SIZE_OPTIONS,

    DEFAULT_SORT_MODEL,

    ORGANIZATION_EXPORT_FILE_NAME,

    ORGANIZATION_ROLES,

    ORGANIZATION_SORT_FIELDS,

    ORGANIZATION_COLUMNS,

    ORGANIZATION_DIALOG_TYPES,

    ORGANIZATION_API_ENDPOINTS,

    ORGANIZATION_PERMISSIONS,

    ORGANIZATION_TABLE_DEFAULT_STATE,

    ORGANIZATION_SEARCH_DEBOUNCE,

    ORGANIZATION_MAX_DESCRIPTION_LENGTH,

    ORGANIZATION_CACHE_KEY,

    ORGANIZATION_DATE_FORMAT_OPTIONS,

    ORGANIZATION_FORM_MODES

};

