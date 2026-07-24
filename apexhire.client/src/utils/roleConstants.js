export const ROLE_KEYS = Object.freeze({
    CANDIDATE: "candidate",
    RECRUITER: "recruiter",
    HIRING_MANAGER: "hiringmanager",
    ADMIN: "admin"
});

export const ROLE_DESCRIPTIONS = Object.freeze({
    candidate:
        "Can maintain a candidate profile, search for jobs, submit applications, and manage interviews.",

    recruiter:
        "Can publish job vacancies, review candidates, manage applications, and arrange interviews.",

    hiringmanager:
        "Can evaluate candidates, provide feedback, and participate in hiring decisions.",

    admin:
        "Can manage users, organizations, departments, roles, reports, analytics, and system settings."
});

export const ROLE_COLORS = Object.freeze({
    candidate: "primary",
    recruiter: "success",
    hiringmanager: "warning",
    admin: "error"
});

export const ROLE_SORT_OPTIONS = Object.freeze([
    {
        label: "Role Value",
        value: "value"
    },
    {
        label: "Role Name (A-Z)",
        value: "name"
    },
    {
        label: "Display Name (A-Z)",
        value: "displayName"
    }
]);

export const DEFAULT_ROLE_FILTERS = Object.freeze({
    search: "",
    sortBy: "value"
});
