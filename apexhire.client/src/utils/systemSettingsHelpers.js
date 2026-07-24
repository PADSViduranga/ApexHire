import {
    DEFAULT_SYSTEM_SETTINGS,
    SYSTEM_SETTINGS_VALIDATION,
} from "./systemSettingsConstants";

export function getSafeString(
    value
) {
    return String(
        value ?? ""
    ).trim();
}

export function sanitizeSystemSettings(
    settings = {}
) {
    return {
        ...DEFAULT_SYSTEM_SETTINGS,

        siteName: getSafeString(
            settings.siteName
        ),

        siteDescription:
            getSafeString(
                settings.siteDescription
            ),

        organizationName:
            getSafeString(
                settings.organizationName
            ),

        organizationEmail:
            getSafeString(
                settings.organizationEmail
            ).toLowerCase(),

        organizationPhone:
            getSafeString(
                settings.organizationPhone
            ),

        organizationAddress:
            getSafeString(
                settings.organizationAddress
            ),

        smtpHost:
            getSafeString(
                settings.smtpHost
            ),

        smtpPort:
            Number(
                settings.smtpPort
            ) ||
            DEFAULT_SYSTEM_SETTINGS.smtpPort,

        smtpUsername:
            getSafeString(
                settings.smtpUsername
            ),

        smtpPassword:
            getSafeString(
                settings.smtpPassword
            ),

        smtpSenderName:
            getSafeString(
                settings.smtpSenderName
            ),

        smtpSenderEmail:
            getSafeString(
                settings.smtpSenderEmail
            ).toLowerCase(),

        enableEmailNotifications:
            Boolean(
                settings.enableEmailNotifications
            ),

        enableApplicationNotifications:
            Boolean(
                settings.enableApplicationNotifications
            ),

        enableInterviewNotifications:
            Boolean(
                settings.enableInterviewNotifications
            ),

        enableMaintenanceNotifications:
            Boolean(
                settings.enableMaintenanceNotifications
            ),

        passwordMinLength:
            Number(
                settings.passwordMinLength
            ) ||
            DEFAULT_SYSTEM_SETTINGS.passwordMinLength,

        passwordRequireUppercase:
            Boolean(
                settings.passwordRequireUppercase
            ),

        passwordRequireLowercase:
            Boolean(
                settings.passwordRequireLowercase
            ),

        passwordRequireNumber:
            Boolean(
                settings.passwordRequireNumber
            ),

        passwordRequireSpecialCharacter:
            Boolean(
                settings.passwordRequireSpecialCharacter
            ),

        accountLockoutAttempts:
            Number(
                settings.accountLockoutAttempts
            ) ||
            DEFAULT_SYSTEM_SETTINGS.accountLockoutAttempts,

        accountLockoutMinutes:
            Number(
                settings.accountLockoutMinutes
            ) ||
            DEFAULT_SYSTEM_SETTINGS.accountLockoutMinutes,

        sessionTimeoutMinutes:
            Number(
                settings.sessionTimeoutMinutes
            ) ||
            DEFAULT_SYSTEM_SETTINGS.sessionTimeoutMinutes,

        maintenanceMode:
            Boolean(
                settings.maintenanceMode
            ),

        allowRegistration:
            Boolean(
                settings.allowRegistration
            ),

        allowRecruiterRegistration:
            Boolean(
                settings.allowRecruiterRegistration
            ),

        backupFrequency:
            getSafeString(
                settings.backupFrequency
            ) ||
            DEFAULT_SYSTEM_SETTINGS.backupFrequency,

        timezone:
            getSafeString(
                settings.timezone
            ) ||
            DEFAULT_SYSTEM_SETTINGS.timezone,

        dateFormat:
            getSafeString(
                settings.dateFormat
            ) ||
            DEFAULT_SYSTEM_SETTINGS.dateFormat,

        currency:
            getSafeString(
                settings.currency
            ) ||
            DEFAULT_SYSTEM_SETTINGS.currency,

        language:
            getSafeString(
                settings.language
            ) ||
            DEFAULT_SYSTEM_SETTINGS.language,
    };
}

export function isValidEmail(
    email
) {
    if (!email) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}

export function clampNumber(
    value,
    min,
    max
) {
    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {
        return min;
    }

    return Math.min(
        Math.max(
            number,
            min
        ),
        max
    );
}

export function normalizeSystemSettings(
    settings
) {
    const data =
        sanitizeSystemSettings(
            settings
        );

    data.smtpPort =
        clampNumber(
            data.smtpPort,
            SYSTEM_SETTINGS_VALIDATION.SMTP_PORT_MIN,
            SYSTEM_SETTINGS_VALIDATION.SMTP_PORT_MAX
        );

    data.passwordMinLength =
        clampNumber(
            data.passwordMinLength,
            SYSTEM_SETTINGS_VALIDATION.PASSWORD_MIN,
            SYSTEM_SETTINGS_VALIDATION.PASSWORD_MAX
        );

    data.accountLockoutAttempts =
        clampNumber(
            data.accountLockoutAttempts,
            SYSTEM_SETTINGS_VALIDATION.LOCKOUT_ATTEMPTS_MIN,
            SYSTEM_SETTINGS_VALIDATION.LOCKOUT_ATTEMPTS_MAX
        );

    data.sessionTimeoutMinutes =
        clampNumber(
            data.sessionTimeoutMinutes,
            SYSTEM_SETTINGS_VALIDATION.SESSION_TIMEOUT_MIN,
            SYSTEM_SETTINGS_VALIDATION.SESSION_TIMEOUT_MAX
        );

    return data;
}
