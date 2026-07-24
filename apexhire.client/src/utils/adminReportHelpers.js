import {
    REPORT_DATETIME_FORMAT_OPTIONS,
    REPORT_DATE_FORMAT_OPTIONS,
} from "./adminReportConstants";

export function getSafeNumber(
    value,
    fallback = 0
) {
    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : fallback;
}

export function formatNumber(
    value
) {
    return new Intl.NumberFormat().format(
        getSafeNumber(value)
    );
}

export function formatPercentage(
    value,
    decimals = 1
) {
    return `${getSafeNumber(value).toFixed(
        decimals
    )}%`;
}

export function formatDays(
    value
) {
    const days = getSafeNumber(value);

    return `${days.toFixed(
        days % 1 === 0 ? 0 : 1
    )} day${days === 1 ? "" : "s"}`;
}

export function formatDate(
    value
) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        undefined,
        REPORT_DATE_FORMAT_OPTIONS
    ).format(date);
}

export function formatDateTime(
    value
) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        undefined,
        REPORT_DATETIME_FORMAT_OPTIONS
    ).format(date);
}

export function normalizeDateForQuery(
    value,
    endOfDay = false
) {
    if (!value) {
        return undefined;
    }

    const date =
        value instanceof Date
            ? new Date(value)
            : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    if (endOfDay) {
        date.setHours(
            23,
            59,
            59,
            999
        );
    } else {
        date.setHours(
            0,
            0,
            0,
            0
        );
    }

    return date.toISOString();
}

export function getPeriodDateRange(
    period
) {
    const today = new Date();

    const endDate = new Date(today);

    endDate.setHours(
        23,
        59,
        59,
        999
    );

    const startDate = new Date(today);

    startDate.setHours(
        0,
        0,
        0,
        0
    );

    switch (period) {
        case "7days":
            startDate.setDate(
                startDate.getDate() - 6
            );
            break;

        case "30days":
            startDate.setDate(
                startDate.getDate() - 29
            );
            break;

        case "90days":
            startDate.setDate(
                startDate.getDate() - 89
            );
            break;

        case "6months":
            startDate.setMonth(
                startDate.getMonth() - 6
            );
            break;

        case "12months":
            startDate.setFullYear(
                startDate.getFullYear() - 1
            );
            break;

        default:
            return {
                fromDate: undefined,
                toDate: undefined,
            };
    }

    return {
        fromDate:
            startDate.toISOString(),

        toDate:
            endDate.toISOString(),
    };
}

export function buildReportQuery(
    filters
) {
    const periodRange =
        filters.period !== "custom"
            ? getPeriodDateRange(
                  filters.period
              )
            : {
                  fromDate:
                      normalizeDateForQuery(
                          filters.fromDate
                      ),

                  toDate:
                      normalizeDateForQuery(
                          filters.toDate,
                          true
                      ),
              };

    return {
        period:
            filters.period,

        fromDate:
            periodRange.fromDate,

        toDate:
            periodRange.toDate,

        organizationId:
            filters.organizationId ||
            undefined,

        departmentId:
            filters.departmentId ||
            undefined,

        recruiterId:
            filters.recruiterId ||
            undefined,

        jobId:
            filters.jobId ||
            undefined,

        applicationStatus:
            filters.applicationStatus ||
            undefined,
    };
}

export function validateCustomDateRange(
    filters
) {
    if (filters.period !== "custom") {
        return "";
    }

    if (
        !filters.fromDate ||
        !filters.toDate
    ) {
        return "Select both start and end dates.";
    }

    const fromDate =
        new Date(filters.fromDate);

    const toDate =
        new Date(filters.toDate);

    if (
        Number.isNaN(fromDate.getTime()) ||
        Number.isNaN(toDate.getTime())
    ) {
        return "Select a valid date range.";
    }

    if (fromDate > toDate) {
        return "Start date cannot be after end date.";
    }

    return "";
}

export function calculatePercentageChange(
    currentValue,
    previousValue
) {
    const current =
        getSafeNumber(currentValue);

    const previous =
        getSafeNumber(previousValue);

    if (previous === 0) {
        return current === 0
            ? 0
            : 100;
    }

    return (
        ((current - previous) /
            Math.abs(previous)) *
        100
    );
}

export function getTrendDirection(
    value
) {
    const numberValue =
        getSafeNumber(value);

    if (numberValue > 0) {
        return "up";
    }

    if (numberValue < 0) {
        return "down";
    }

    return "neutral";
}

export function sanitizeFileName(
    value
) {
    return String(value || "report")
        .trim()
        .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
        )
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
}
