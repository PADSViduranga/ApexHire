import axiosClient from "../api/axiosClient";

const AUDIT_LOGS_ENDPOINT = "/admin/auditlogs";

function removeEmptyParameters(parameters) {
    return Object.fromEntries(
        Object.entries(parameters).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        )
    );
}

export async function getAuditLogs(
    query = {},
    signal
) {
    const parameters = removeEmptyParameters({
        pageNumber: query.pageNumber ?? 1,
        pageSize: query.pageSize ?? 20,
        search: query.search,
        userId: query.userId,
        action: query.action,
        module: query.module,
        entityName: query.entityName,
        entityId: query.entityId,
        severity: query.severity,
        status: query.status,
        fromDate: query.fromDate,
        toDate: query.toDate,
        sortBy: query.sortBy ?? "createdAt",
        sortDirection:
            query.sortDirection ?? "desc",
    });

    const response = await axiosClient.get(
        AUDIT_LOGS_ENDPOINT,
        {
            params: parameters,
            signal,
        }
    );

    return response.data;
}

export async function getAuditLogById(
    auditLogId,
    signal
) {
    if (
        auditLogId === undefined ||
        auditLogId === null
    ) {
        throw new Error(
            "Audit log ID is required."
        );
    }

    const response = await axiosClient.get(
        `${AUDIT_LOGS_ENDPOINT}/${auditLogId}`,
        {
            signal,
        }
    );

    return response.data;
}

export async function cleanupAuditLogs(
    beforeDate
) {
    if (!beforeDate) {
        throw new Error(
            "Cleanup date is required."
        );
    }

    await axiosClient.delete(
        `${AUDIT_LOGS_ENDPOINT}/cleanup`,
        {
            params: {
                before:
                    beforeDate instanceof Date
                        ? beforeDate.toISOString()
                        : beforeDate,
            },
        }
    );
}

const auditLogService = Object.freeze({
    getAuditLogs,
    getAuditLogById,
    cleanupAuditLogs,
});

export default auditLogService;
