// ============================================
// Audit Log Constants
// ============================================

export const AUDIT_ACTIONS = Object.freeze({
    CREATE: "Create",
    UPDATE: "Update",
    DELETE: "Delete",
    LOGIN: "Login",
    LOGOUT: "Logout",
    REGISTER: "Register",
    APPROVE: "Approve",
    REJECT: "Reject",
    ASSIGN: "Assign",
    EXPORT: "Export",
    IMPORT: "Import",
    UNKNOWN: "Unknown",
});

export const ACTION_COLORS = Object.freeze({
    Create: "success",
    Update: "warning",
    Delete: "error",
    Login: "info",
    Logout: "default",
    Register: "secondary",
    Approve: "success",
    Reject: "error",
    Assign: "primary",
    Export: "secondary",
    Import: "primary",
    Unknown: "default",
});

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = Object.freeze([
    10,
    25,
    50,
    100,
]);

export const DEFAULT_SORT_FIELD = "createdAt";
export const DEFAULT_SORT_DIRECTION = "desc";

export const DATE_FORMAT = "dd MMM yyyy";
export const DATE_TIME_FORMAT = "dd MMM yyyy hh:mm a";

export const FILTER_ALL = "All";

export const ENTITY_TYPES = Object.freeze([
    FILTER_ALL,
    "User",
    "Candidate",
    "Recruiter",
    "HiringManager",
    "Organization",
    "Department",
    "Job",
    "Application",
    "Interview",
    "Role",
    "Permission",
]);

export const ACTION_FILTERS = Object.freeze([
    FILTER_ALL,
    ...Object.values(AUDIT_ACTIONS),
]);

export const SEARCH_DEBOUNCE = 500;

export const MAX_DETAILS_LENGTH = 500;

export const EMPTY_STATE_MESSAGES = Object.freeze({
    title: "No audit logs found",
    description:
        "There are no audit log records matching the selected filters.",
});

export const AUDIT_ACTION_OPTIONS =
    ACTION_FILTERS;

export const AUDIT_MODULE_OPTIONS =
    Object.freeze([
        FILTER_ALL,
        "Authentication",
        "Users",
        "Organizations",
        "Departments",
        "Roles",
        "Jobs",
        "Applications",
        "Interviews",
        "Reports",
        "Analytics",
        "Settings",
    ]);

export const AUDIT_SEVERITY_OPTIONS =
    Object.freeze([
        FILTER_ALL,
        "Information",
        "Warning",
        "Error",
        "Critical",
    ]);

export const AUDIT_STATUS_OPTIONS =
    Object.freeze([
        FILTER_ALL,
        "Success",
        "Failed",
    ]);
