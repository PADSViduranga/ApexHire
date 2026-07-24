import {
    EMPTY_ADMIN_PROFILE,
    EMPTY_ADMIN_PROFILE_DATA,
} from "./adminProfileConstants";

import {
    buildFullName,
    formatProfileDate,
    formatProfileDateTime,
    getSafeString,
} from "./adminProfileHelpers";

function mapProfile(
    source = {}
) {
    const firstName =
        getSafeString(
            source.firstName
        );

    const lastName =
        getSafeString(
            source.lastName
        );

    return {
        ...EMPTY_ADMIN_PROFILE,

        id:
            source.id ??
            null,

        firstName,

        lastName,

        fullName:
            buildFullName(
                firstName,
                lastName
            ),

        email:
            getSafeString(
                source.email
            ),

        phoneNumber:
            getSafeString(
                source.phoneNumber
            ),

        profileImageUrl:
            getSafeString(
                source.profileImageUrl
            ),

        role:
            getSafeString(
                source.role
            ),

        status:
            getSafeString(
                source.status
            ),

        organizationName:
            getSafeString(
                source.organizationName
            ),

        departmentName:
            getSafeString(
                source.departmentName
            ),

        jobTitle:
            getSafeString(
                source.jobTitle
            ),

        location:
            getSafeString(
                source.location
            ),

        bio:
            getSafeString(
                source.bio
            ),

        lastLoginAt:
            source.lastLoginAt ??
            null,

        createdAt:
            source.createdAt ??
            null,

        updatedAt:
            source.updatedAt ??
            null,

        formattedLastLogin:
            formatProfileDateTime(
                source.lastLoginAt
            ),

        formattedCreatedAt:
            formatProfileDate(
                source.createdAt
            ),

        formattedUpdatedAt:
            formatProfileDateTime(
                source.updatedAt
            ),
    };
}

function mapSession(
    source = {}
) {
    return {
        id:
            source.id ??
            null,

        device:
            getSafeString(
                source.device
            ),

        browser:
            getSafeString(
                source.browser
            ),

        operatingSystem:
            getSafeString(
                source.operatingSystem
            ),

        ipAddress:
            getSafeString(
                source.ipAddress
            ),

        location:
            getSafeString(
                source.location
            ),

        status:
            getSafeString(
                source.status
            ),

        isCurrent:
            Boolean(
                source.isCurrent
            ),

        lastActivityAt:
            source.lastActivityAt ??
            null,

        formattedLastActivity:
            formatProfileDateTime(
                source.lastActivityAt
            ),
    };
}

function mapActivity(
    source = {}
) {
    return {
        id:
            source.id ??
            null,

        action:
            getSafeString(
                source.action
            ),

        description:
            getSafeString(
                source.description
            ),

        ipAddress:
            getSafeString(
                source.ipAddress
            ),

        createdAt:
            source.createdAt ??
            null,

        formattedCreatedAt:
            formatProfileDateTime(
                source.createdAt
            ),
    };
}

function mapArray(
    items,
    mapper
) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map(mapper);
}

export function mapAdminProfile(
    response = {}
) {
    const data =
        response.data ??
        response;

    return {
        ...EMPTY_ADMIN_PROFILE_DATA,

        profile:
            mapProfile(
                data.profile ??
                data
            ),

        activeSessions:
            mapArray(
                data.activeSessions,
                mapSession
            ),

        recentActivity:
            mapArray(
                data.recentActivity,
                mapActivity
            ),
    };
}
