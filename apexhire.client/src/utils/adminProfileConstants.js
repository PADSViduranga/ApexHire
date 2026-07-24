export const ADMIN_PROFILE_TABS = {
    PERSONAL: "personal",
    ACCOUNT: "account",
    SECURITY: "security",
    SESSIONS: "sessions",
    ACTIVITY: "activity",
};

export const ADMIN_PROFILE_TAB_OPTIONS = [
    {
        value: ADMIN_PROFILE_TABS.PERSONAL,
        label: "Personal Information",
    },
    {
        value: ADMIN_PROFILE_TABS.ACCOUNT,
        label: "Account Information",
    },
    {
        value: ADMIN_PROFILE_TABS.SECURITY,
        label: "Security",
    },
    {
        value: ADMIN_PROFILE_TABS.SESSIONS,
        label: "Active Sessions",
    },
    {
        value: ADMIN_PROFILE_TABS.ACTIVITY,
        label: "Recent Activity",
    },
];

export const EMPTY_ADMIN_PROFILE = {
    id: null,
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    profileImageUrl: "",
    role: "",
    status: "",
    organizationName: "",
    departmentName: "",
    jobTitle: "",
    location: "",
    bio: "",
    lastLoginAt: null,
    createdAt: null,
    updatedAt: null,
};

export const DEFAULT_ADMIN_PROFILE_FORM = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    jobTitle: "",
    location: "",
    bio: "",
};

export const DEFAULT_ADMIN_PASSWORD_FORM = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export const EMPTY_ADMIN_PROFILE_DATA = {
    profile: {
        ...EMPTY_ADMIN_PROFILE,
    },
    activeSessions: [],
    recentActivity: [],
};

export const ADMIN_PROFILE_VALIDATION = {
    FIRST_NAME_MAX_LENGTH: 100,
    LAST_NAME_MAX_LENGTH: 100,
    PHONE_MAX_LENGTH: 30,
    JOB_TITLE_MAX_LENGTH: 150,
    LOCATION_MAX_LENGTH: 150,
    BIO_MAX_LENGTH: 500,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
};

export const ADMIN_PROFILE_IMAGE = {
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ACCEPTED_TYPES: [
        "image/jpeg",
        "image/png",
        "image/webp",
    ],
    ACCEPT_ATTRIBUTE:
        "image/jpeg,image/png,image/webp",
};

export const ADMIN_PROFILE_ACTIVITY_LIMIT = 10;

export const ADMIN_PROFILE_SESSION_STATUS = {
    CURRENT: "current",
    ACTIVE: "active",
    EXPIRED: "expired",
    REVOKED: "revoked",
};

export const ADMIN_PROFILE_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    LOCKED: "locked",
    SUSPENDED: "suspended",
};
