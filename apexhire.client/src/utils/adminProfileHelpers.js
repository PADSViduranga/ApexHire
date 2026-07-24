import {
    ADMIN_PROFILE_IMAGE,
    ADMIN_PROFILE_VALIDATION,
} from "./adminProfileConstants";

export function getSafeString(
    value,
    fallback = ""
) {
    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    return String(value).trim();
}

export function getInitials(
    firstName,
    lastName
) {
    const firstInitial =
        getSafeString(firstName)
            .charAt(0)
            .toUpperCase();

    const lastInitial =
        getSafeString(lastName)
            .charAt(0)
            .toUpperCase();

    return (
        `${firstInitial}${lastInitial}` ||
        "AD"
    );
}

export function formatProfileDate(
    value,
    fallback = "—"
) {
    if (!value) {
        return fallback;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }
    ).format(date);
}

export function formatProfileDateTime(
    value,
    fallback = "—"
) {
    if (!value) {
        return fallback;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(date);
}

export function buildFullName(
    firstName,
    lastName
) {
    return [
        getSafeString(firstName),
        getSafeString(lastName),
    ]
        .filter(Boolean)
        .join(" ");
}

export function sanitizeProfileForm(
    form = {}
) {
    return {
        firstName:
            getSafeString(
                form.firstName
            ),

        lastName:
            getSafeString(
                form.lastName
            ),

        phoneNumber:
            getSafeString(
                form.phoneNumber
            ),

        jobTitle:
            getSafeString(
                form.jobTitle
            ),

        location:
            getSafeString(
                form.location
            ),

        bio:
            getSafeString(
                form.bio
            ),
    };
}

export function validateProfileImage(
    file
) {
    if (!file) {
        return "Please select an image.";
    }

    if (
        !ADMIN_PROFILE_IMAGE
            .ACCEPTED_TYPES
            .includes(file.type)
    ) {
        return "Only JPG, PNG, and WebP images are allowed.";
    }

    if (
        file.size >
        ADMIN_PROFILE_IMAGE.MAX_SIZE_BYTES
    ) {
        return "Profile image must be 5 MB or smaller.";
    }

    return "";
}

export function validateProfileForm(
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
            "First name is too long.";
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
            "Last name is too long.";
    }

    if (
        phoneNumber.length >
        ADMIN_PROFILE_VALIDATION
            .PHONE_MAX_LENGTH
    ) {
        errors.phoneNumber =
            "Phone number is too long.";
    }

    if (
        jobTitle.length >
        ADMIN_PROFILE_VALIDATION
            .JOB_TITLE_MAX_LENGTH
    ) {
        errors.jobTitle =
            "Job title is too long.";
    }

    if (
        location.length >
        ADMIN_PROFILE_VALIDATION
            .LOCATION_MAX_LENGTH
    ) {
        errors.location =
            "Location is too long.";
    }

    if (
        bio.length >
        ADMIN_PROFILE_VALIDATION
            .BIO_MAX_LENGTH
    ) {
        errors.bio =
            "Bio is too long.";
    }

    return errors;
}

export function hasValidationErrors(
    errors = {}
) {
    return Object.keys(errors).length > 0;
}
