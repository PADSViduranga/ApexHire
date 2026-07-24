import {
    formatAuditDate,
    formatExecutionTime,
    formatJsonValue,
    formatRelativeTime,
    getBrowserName,
    getDeviceType,
    getSafeText,
    getUserInitials,
} from "./auditLogHelpers";

const ACTION_NAMES = Object.freeze({
    0: "Unknown",
    1: "Create",
    2: "Update",
    3: "Delete",
    4: "Login",
    5: "Logout",
    6: "Register",
    7: "Approve",
    8: "Reject",
    9: "Assign",
    10: "Export",
    11: "Import",
});

const SEVERITY_NAMES = Object.freeze({
    0: "Trace",
    1: "Debug",
    2: "Information",
    3: "Warning",
    4: "Error",
    5: "Critical",
});

const STATUS_NAMES = Object.freeze({
    0: "Success",
    1: "Failure",
    2: "Pending",
});

function normalizeEnumValue(
    value,
    mappings,
    fallback
) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return fallback;
    }

    if (
        typeof value === "number" &&
        mappings[value]
    ) {
        return mappings[value];
    }

    const numericValue = Number(value);

    if (
        Number.isInteger(numericValue) &&
        mappings[numericValue]
    ) {
        return mappings[numericValue];
    }

    const text = String(value).trim();

    if (!text) {
        return fallback;
    }

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}

function normalizeNullableNumber(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : null;
}

export function mapAuditLog(
    source = {}
) {
    const action = normalizeEnumValue(
        source.action,
        ACTION_NAMES,
        "Unknown"
    );

    const severity = normalizeEnumValue(
        source.severity,
        SEVERITY_NAMES,
        "Information"
    );

    const status = normalizeEnumValue(
        source.status,
        STATUS_NAMES,
        "Success"
    );

    const createdAt =
        source.createdAt ?? null;

    const userName = getSafeText(
        source.userName,
        getSafeText(
            source.email,
            "System"
        )
    );

    return {
        id: source.id ?? null,

        traceId:
            source.traceId ?? null,

        correlationId:
            source.correlationId ?? null,

        userId:
            normalizeNullableNumber(
                source.userId
            ),

        userName,

        email:
            source.email ?? null,

        userInitials:
            getUserInitials(
                source.userName,
                source.email
            ),

        action,

        module:
            getSafeText(
                source.module,
                "Unknown"
            ),

        entityName:
            getSafeText(
                source.entityName,
                "Unknown"
            ),

        entityId:
            source.entityId ?? null,

        entityLabel:
            source.entityId
                ? `${getSafeText(
                      source.entityName,
                      "Entity"
                  )} #${source.entityId}`
                : getSafeText(
                      source.entityName,
                      "Unknown"
                  ),

        description:
            getSafeText(
                source.description,
                "No description available."
            ),

        severity,

        status,

        oldValues:
            source.oldValues ?? null,

        newValues:
            source.newValues ?? null,

        formattedOldValues:
            formatJsonValue(
                source.oldValues
            ),

        formattedNewValues:
            formatJsonValue(
                source.newValues
            ),

        ipAddress:
            source.ipAddress ?? null,

        userAgent:
            source.userAgent ?? null,

        browser:
            getBrowserName(
                source.userAgent
            ),

        device:
            getDeviceType(
                source.userAgent
            ),

        requestPath:
            source.requestPath ?? null,

        httpMethod:
            source.httpMethod
                ? String(
                      source.httpMethod
                  ).toUpperCase()
                : null,

        responseStatusCode:
            normalizeNullableNumber(
                source.responseStatusCode
            ),

        executionTimeMs:
            normalizeNullableNumber(
                source.executionTimeMs
            ),

        formattedExecutionTime:
            formatExecutionTime(
                source.executionTimeMs
            ),

        createdAt,

        formattedCreatedAt:
            formatAuditDate(
                createdAt,
                {
                    includeSeconds: true,
                }
            ),

        relativeCreatedAt:
            formatRelativeTime(
                createdAt
            ),
    };
}

export function mapAuditLogs(
    items
) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map(mapAuditLog);
}

export function mapAuditLogPagedResult(
    source = {}
) {
    const data =
        source.data ?? source;

    const items =
        data.items ??
        data.Items ??
        [];

    const pageNumber =
        Number(
            data.pageNumber ??
                data.page ??
                1
        ) || 1;

    const pageSize =
        Number(
            data.pageSize ??
                20
        ) || 20;

    const totalCount =
        Number(
            data.totalCount ??
                data.totalItems ??
                0
        ) || 0;

    const calculatedTotalPages =
        pageSize > 0
            ? Math.ceil(
                  totalCount / pageSize
              )
            : 0;

    const totalPages =
        Number(
            data.totalPages ??
                calculatedTotalPages
        ) || 0;

    return {
        items:
            mapAuditLogs(items),

        pageNumber,

        pageSize,

        totalCount,

        totalPages,

        hasPreviousPage:
            data.hasPreviousPage ??
            pageNumber > 1,

        hasNextPage:
            data.hasNextPage ??
            pageNumber < totalPages,

        success:
            source.success ?? true,

        message:
            source.message ?? "",
    };
}

export function mapAuditLogDetails(
    source = {}
) {
    const data =
        source.data ?? source;

    return mapAuditLog(data);
}
