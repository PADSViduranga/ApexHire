import {
    ADMIN_PROFILE_VALIDATION,
} from "./adminProfileConstants";

import {
    getSafeString,
} from "./adminProfileHelpers";

export function validateAdminProfileForm(
    form = {}
) {
    const errors = {};

    const firstName =
        getSafeString(form.firstName);

    const lastName =
        getSafeString(form.lastName);

    const phoneNumber =
        getSafeString(form.phoneNumber);

    const jobTitle =
        getSafeString(form.jobTitle);

    const location =
        getSafeString(form.location);

    const bio =
        getSafeString(form.bio);

    if (!firstName) {
        errors.firstName =
            "First name is required.";
    } else if (
        firstName.length >
        ADMIN_PROFILE_VALIDATION
            .FIRST_NAME_MAX_LENGTH
    ) {
        errors.firstName =
            `First name cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .FIRST_NAME_MAX_LENGTH
            } characters.`;
    }

    if (!lastName) {
        errors.lastName =
            "Last name is required.";
    } else if (
        lastName.length >
        ADMIN_PROFILE_VALIDATION
            .LAST_NAME_MAX_LENGTH
    ) {
        errors.lastName =
            `Last name cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .LAST_NAME_MAX_LENGTH
            } characters.`;
    }

    if (
        phoneNumber &&
        !/^[0-9+\-()\s]+$/.test(
            phoneNumber
        )
    ) {
        errors.phoneNumber =
            "Enter a valid phone number.";
    } else if (
        phoneNumber.length >
        ADMIN_PROFILE_VALIDATION
            .PHONE_MAX_LENGTH
    ) {
        errors.phoneNumber =
            `Phone number cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .PHONE_MAX_LENGTH
            } characters.`;
    }

    if (
        jobTitle.length >
        ADMIN_PROFILE_VALIDATION
            .JOB_TITLE_MAX_LENGTH
    ) {
        errors.jobTitle =
            `Job title cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .JOB_TITLE_MAX_LENGTH
            } characters.`;
    }

    if (
        location.length >
        ADMIN_PROFILE_VALIDATION
            .LOCATION_MAX_LENGTH
    ) {
        errors.location =
            `Location cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .LOCATION_MAX_LENGTH
            } characters.`;
    }

    if (
        bio.length >
        ADMIN_PROFILE_VALIDATION
            .BIO_MAX_LENGTH
    ) {
        errors.bio =
            `Bio cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .BIO_MAX_LENGTH
            } characters.`;
    }

    return errors;
}

export function validateAdminPasswordForm(
    form = {}
) {
    const errors = {};

    const currentPassword =
        String(
            form.currentPassword ?? ""
        );

    const newPassword =
        String(
            form.newPassword ?? ""
        );

    const confirmPassword =
        String(
            form.confirmPassword ?? ""
        );

    if (!currentPassword) {
        errors.currentPassword =
            "Current password is required.";
    }

    if (!newPassword) {
        errors.newPassword =
            "New password is required.";
    } else if (
        newPassword.length <
        ADMIN_PROFILE_VALIDATION
            .PASSWORD_MIN_LENGTH
    ) {
        errors.newPassword =
            `Password must contain at least ${
                ADMIN_PROFILE_VALIDATION
                    .PASSWORD_MIN_LENGTH
            } characters.`;
    } else if (
        newPassword.length >
        ADMIN_PROFILE_VALIDATION
            .PASSWORD_MAX_LENGTH
    ) {
        errors.newPassword =
            `Password cannot exceed ${
                ADMIN_PROFILE_VALIDATION
                    .PASSWORD_MAX_LENGTH
            } characters.`;
    } else if (
        !/[A-Z]/.test(newPassword)
    ) {
        errors.newPassword =
            "Password must contain an uppercase letter.";
    } else if (
        !/[a-z]/.test(newPassword)
    ) {
        errors.newPassword =
            "Password must contain a lowercase letter.";
    } else if (
        !/[0-9]/.test(newPassword)
    ) {
        errors.newPassword =
            "Password must contain a number.";
    } else if (
        !/[^A-Za-z0-9]/.test(
            newPassword
        )
    ) {
        errors.newPassword =
            "Password must contain a special character.";
    } else if (
        newPassword === currentPassword
    ) {
        errors.newPassword =
            "New password must be different from the current password.";
    }

    if (!confirmPassword) {
        errors.confirmPassword =
            "Confirm password is required.";
    } else if (
        newPassword !== confirmPassword
    ) {
        errors.confirmPassword =
            "Passwords do not match.";
    }

    return errors;
}

export function hasAdminProfileErrors(
    errors = {}
) {
    return Object.keys(errors).length > 0;
}
