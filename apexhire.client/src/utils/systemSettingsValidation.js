import {
    SYSTEM_SETTINGS_VALIDATION,
} from "./systemSettingsConstants";

import {
    getSafeString,
    isValidEmail,
} from "./systemSettingsHelpers";

export function validateSystemSettings(
    settings = {}
) {
    const errors = {};

    const siteName =
        getSafeString(
            settings.siteName
        );

    const siteDescription =
        getSafeString(
            settings.siteDescription
        );

    const organizationName =
        getSafeString(
            settings.organizationName
        );

    const organizationEmail =
        getSafeString(
            settings.organizationEmail
        );

    const organizationPhone =
        getSafeString(
            settings.organizationPhone
        );

    const organizationAddress =
        getSafeString(
            settings.organizationAddress
        );

    const smtpHost =
        getSafeString(
            settings.smtpHost
        );

    const smtpUsername =
        getSafeString(
            settings.smtpUsername
        );

    const smtpPassword =
        getSafeString(
            settings.smtpPassword
        );

    const smtpSenderName =
        getSafeString(
            settings.smtpSenderName
        );

    const smtpSenderEmail =
        getSafeString(
            settings.smtpSenderEmail
        );

    const smtpPort =
        Number(
            settings.smtpPort
        );

    const passwordMinLength =
        Number(
            settings.passwordMinLength
        );

    const accountLockoutAttempts =
        Number(
            settings.accountLockoutAttempts
        );

    const accountLockoutMinutes =
        Number(
            settings.accountLockoutMinutes
        );

    const sessionTimeoutMinutes =
        Number(
            settings.sessionTimeoutMinutes
        );

    if (!siteName) {
        errors.siteName =
            "Site name is required.";
    } else if (
        siteName.length >
        SYSTEM_SETTINGS_VALIDATION
            .SITE_NAME_MAX_LENGTH
    ) {
        errors.siteName =
            `Site name cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .SITE_NAME_MAX_LENGTH
            } characters.`;
    }

    if (
        siteDescription.length >
        SYSTEM_SETTINGS_VALIDATION
            .SITE_DESCRIPTION_MAX_LENGTH
    ) {
        errors.siteDescription =
            `Site description cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .SITE_DESCRIPTION_MAX_LENGTH
            } characters.`;
    }

    if (!organizationName) {
        errors.organizationName =
            "Organization name is required.";
    } else if (
        organizationName.length >
        SYSTEM_SETTINGS_VALIDATION
            .ORGANIZATION_NAME_MAX_LENGTH
    ) {
        errors.organizationName =
            `Organization name cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .ORGANIZATION_NAME_MAX_LENGTH
            } characters.`;
    }

    if (!organizationEmail) {
        errors.organizationEmail =
            "Organization email is required.";
    } else if (
        !isValidEmail(
            organizationEmail
        )
    ) {
        errors.organizationEmail =
            "Enter a valid organization email.";
    }

    if (
        organizationPhone.length >
        SYSTEM_SETTINGS_VALIDATION
            .ORGANIZATION_PHONE_MAX_LENGTH
    ) {
        errors.organizationPhone =
            `Phone number cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .ORGANIZATION_PHONE_MAX_LENGTH
            } characters.`;
    }

    if (
        organizationAddress.length >
        SYSTEM_SETTINGS_VALIDATION
            .ORGANIZATION_ADDRESS_MAX_LENGTH
    ) {
        errors.organizationAddress =
            `Address cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .ORGANIZATION_ADDRESS_MAX_LENGTH
            } characters.`;
    }

    if (
        smtpHost.length >
        SYSTEM_SETTINGS_VALIDATION
            .SMTP_HOST_MAX_LENGTH
    ) {
        errors.smtpHost =
            `SMTP host cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .SMTP_HOST_MAX_LENGTH
            } characters.`;
    }

    if (
        !Number.isInteger(
            smtpPort
        ) ||
        smtpPort <
            SYSTEM_SETTINGS_VALIDATION
                .SMTP_PORT_MIN ||
        smtpPort >
            SYSTEM_SETTINGS_VALIDATION
                .SMTP_PORT_MAX
    ) {
        errors.smtpPort =
            `SMTP port must be between ${
                SYSTEM_SETTINGS_VALIDATION
                    .SMTP_PORT_MIN
            } and ${
                SYSTEM_SETTINGS_VALIDATION
                    .SMTP_PORT_MAX
            }.`;
    }

    if (
        smtpUsername.length >
        SYSTEM_SETTINGS_VALIDATION
            .SMTP_USERNAME_MAX_LENGTH
    ) {
        errors.smtpUsername =
            `SMTP username cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .SMTP_USERNAME_MAX_LENGTH
            } characters.`;
    }

    if (
        smtpPassword.length >
        SYSTEM_SETTINGS_VALIDATION
            .SMTP_PASSWORD_MAX_LENGTH
    ) {
        errors.smtpPassword =
            `SMTP password cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .SMTP_PASSWORD_MAX_LENGTH
            } characters.`;
    }

    if (
        smtpSenderName.length >
        SYSTEM_SETTINGS_VALIDATION
            .SMTP_SENDER_NAME_MAX_LENGTH
    ) {
        errors.smtpSenderName =
            `Sender name cannot exceed ${
                SYSTEM_SETTINGS_VALIDATION
                    .SMTP_SENDER_NAME_MAX_LENGTH
            } characters.`;
    }

    if (
        smtpSenderEmail &&
        !isValidEmail(
            smtpSenderEmail
        )
    ) {
        errors.smtpSenderEmail =
            "Enter a valid sender email.";
    }

    if (
        !Number.isInteger(
            passwordMinLength
        ) ||
        passwordMinLength <
            SYSTEM_SETTINGS_VALIDATION
                .PASSWORD_MIN ||
        passwordMinLength >
            SYSTEM_SETTINGS_VALIDATION
                .PASSWORD_MAX
    ) {
        errors.passwordMinLength =
            `Password length must be between ${
                SYSTEM_SETTINGS_VALIDATION
                    .PASSWORD_MIN
            } and ${
                SYSTEM_SETTINGS_VALIDATION
                    .PASSWORD_MAX
            }.`;
    }

    if (
        !Number.isInteger(
            accountLockoutAttempts
        ) ||
        accountLockoutAttempts <
            SYSTEM_SETTINGS_VALIDATION
                .LOCKOUT_ATTEMPTS_MIN ||
        accountLockoutAttempts >
            SYSTEM_SETTINGS_VALIDATION
                .LOCKOUT_ATTEMPTS_MAX
    ) {
        errors.accountLockoutAttempts =
            `Lockout attempts must be between ${
                SYSTEM_SETTINGS_VALIDATION
                    .LOCKOUT_ATTEMPTS_MIN
            } and ${
                SYSTEM_SETTINGS_VALIDATION
                    .LOCKOUT_ATTEMPTS_MAX
            }.`;
    }

    if (
        !Number.isInteger(
            accountLockoutMinutes
        ) ||
        accountLockoutMinutes < 1 ||
        accountLockoutMinutes > 1440
    ) {
        errors.accountLockoutMinutes =
            "Lockout duration must be between 1 and 1440 minutes.";
    }

    if (
        !Number.isInteger(
            sessionTimeoutMinutes
        ) ||
        sessionTimeoutMinutes <
            SYSTEM_SETTINGS_VALIDATION
                .SESSION_TIMEOUT_MIN ||
        sessionTimeoutMinutes >
            SYSTEM_SETTINGS_VALIDATION
                .SESSION_TIMEOUT_MAX
    ) {
        errors.sessionTimeoutMinutes =
            `Session timeout must be between ${
                SYSTEM_SETTINGS_VALIDATION
                    .SESSION_TIMEOUT_MIN
            } and ${
                SYSTEM_SETTINGS_VALIDATION
                    .SESSION_TIMEOUT_MAX
            } minutes.`;
    }

    return errors;
}

export function hasSystemSettingsErrors(
    errors = {}
) {
    return Object.keys(
        errors
    ).length > 0;
}
