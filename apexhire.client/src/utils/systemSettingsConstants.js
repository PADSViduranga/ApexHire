export const SYSTEM_SETTINGS_TABS = Object.freeze({
    GENERAL: "general",
    ORGANIZATION: "organization",
    EMAIL: "email",
    NOTIFICATIONS: "notifications",
    SECURITY: "security",
    MAINTENANCE: "maintenance",
    SYSTEM: "system",
});

export const SYSTEM_SETTINGS_TAB_OPTIONS = [
    {
        label: "General",
        value: SYSTEM_SETTINGS_TABS.GENERAL,
    },
    {
        label: "Organization",
        value: SYSTEM_SETTINGS_TABS.ORGANIZATION,
    },
    {
        label: "Email",
        value: SYSTEM_SETTINGS_TABS.EMAIL,
    },
    {
        label: "Notifications",
        value: SYSTEM_SETTINGS_TABS.NOTIFICATIONS,
    },
    {
        label: "Security",
        value: SYSTEM_SETTINGS_TABS.SECURITY,
    },
    {
        label: "Maintenance",
        value: SYSTEM_SETTINGS_TABS.MAINTENANCE,
    },
    {
        label: "System",
        value: SYSTEM_SETTINGS_TABS.SYSTEM,
    },
];

export const DEFAULT_SYSTEM_SETTINGS = Object.freeze({
    siteName: "",
    siteDescription: "",
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationAddress: "",

    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    smtpSenderName: "",
    smtpSenderEmail: "",

    enableEmailNotifications: true,
    enableApplicationNotifications: true,
    enableInterviewNotifications: true,
    enableMaintenanceNotifications: true,

    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecialCharacter: true,
    accountLockoutAttempts: 5,
    accountLockoutMinutes: 30,
    sessionTimeoutMinutes: 60,

    maintenanceMode: false,
    allowRegistration: true,
    allowRecruiterRegistration: false,
    backupFrequency: "Daily",

    timezone: "Asia/Colombo",
    dateFormat: "dd/MM/yyyy",
    currency: "LKR",
    language: "English",
});

export const EMPTY_SYSTEM_INFORMATION = Object.freeze({
    applicationVersion: "",
    framework: "",
    environment: "",
    database: "",
    serverTime: "",
    uptime: "",
    lastBackup: "",
    storageUsed: "",
});

export const EMPTY_SYSTEM_SETTINGS_DATA = Object.freeze({
    settings: {
        ...DEFAULT_SYSTEM_SETTINGS,
    },
    systemInformation: {
        ...EMPTY_SYSTEM_INFORMATION,
    },
});

export const SYSTEM_SETTINGS_VALIDATION = Object.freeze({
    SITE_NAME_MAX_LENGTH: 100,
    SITE_DESCRIPTION_MAX_LENGTH: 300,

    ORGANIZATION_NAME_MAX_LENGTH: 150,
    ORGANIZATION_PHONE_MAX_LENGTH: 30,
    ORGANIZATION_ADDRESS_MAX_LENGTH: 250,

    SMTP_HOST_MAX_LENGTH: 150,
    SMTP_USERNAME_MAX_LENGTH: 150,
    SMTP_PASSWORD_MAX_LENGTH: 200,
    SMTP_SENDER_NAME_MAX_LENGTH: 100,

    PASSWORD_MIN: 6,
    PASSWORD_MAX: 64,

    SESSION_TIMEOUT_MIN: 5,
    SESSION_TIMEOUT_MAX: 1440,

    LOCKOUT_ATTEMPTS_MIN: 3,
    LOCKOUT_ATTEMPTS_MAX: 10,

    SMTP_PORT_MIN: 1,
    SMTP_PORT_MAX: 65535,
});

export const BACKUP_FREQUENCIES = [
    "Hourly",
    "Daily",
    "Weekly",
    "Monthly",
];

export const AVAILABLE_LANGUAGES = [
    "English",
    "Sinhala",
];

export const AVAILABLE_CURRENCIES = [
    "LKR",
    "USD",
];

export const AVAILABLE_TIMEZONES = [
    "Asia/Colombo",
    "UTC",
];

export const AVAILABLE_DATE_FORMATS = [
    "dd/MM/yyyy",
    "MM/dd/yyyy",
    "yyyy-MM-dd",
];
