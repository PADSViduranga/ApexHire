const FALLBACK_TEXT = "—";

export function getSafeText(
    value,
    fallback = FALLBACK_TEXT
) {
    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    const text = String(value).trim();

    return text || fallback;
}

export function getUserInitials(
    userName,
    email
) {
    const source =
        getSafeText(
            userName,
            getSafeText(email, "U")
        );

    const words = source
        .replace(/@.*$/, "")
        .split(/[\s._-]+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "U";
    }

    if (words.length === 1) {
        return words[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`
        .toUpperCase();
}

export function formatAuditDate(
    value,
    options = {}
) {
    if (!value) {
        return FALLBACK_TEXT;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return FALLBACK_TEXT;
    }

    return new Intl.DateTimeFormat(
        options.locale,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: options.includeSeconds
                ? "2-digit"
                : undefined,
            ...options.formatOptions,
        }
    ).format(date);
}

export function formatRelativeTime(
    value
) {
    if (!value) {
        return FALLBACK_TEXT;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return FALLBACK_TEXT;
    }

    const differenceInSeconds =
        Math.round(
            (date.getTime() - Date.now()) /
                1000
        );

    const absoluteSeconds =
        Math.abs(differenceInSeconds);

    let divisor = 1;
    let unit = "second";

    if (absoluteSeconds >= 31536000) {
        divisor = 31536000;
        unit = "year";
    } else if (absoluteSeconds >= 2592000) {
        divisor = 2592000;
        unit = "month";
    } else if (absoluteSeconds >= 86400) {
        divisor = 86400;
        unit = "day";
    } else if (absoluteSeconds >= 3600) {
        divisor = 3600;
        unit = "hour";
    } else if (absoluteSeconds >= 60) {
        divisor = 60;
        unit = "minute";
    }

    const formatter =
        new Intl.RelativeTimeFormat(
            undefined,
            {
                numeric: "auto",
            }
        );

    return formatter.format(
        Math.round(
            differenceInSeconds / divisor
        ),
        unit
    );
}

export function formatExecutionTime(
    milliseconds
) {
    const value = Number(milliseconds);

    if (!Number.isFinite(value)) {
        return FALLBACK_TEXT;
    }

    if (value < 1000) {
        return `${value} ms`;
    }

    return `${(value / 1000).toFixed(2)} s`;
}

export function formatHttpStatus(
    statusCode
) {
    const value = Number(statusCode);

    if (!Number.isInteger(value)) {
        return FALLBACK_TEXT;
    }

    return String(value);
}

export function getHttpStatusColor(
    statusCode
) {
    const value = Number(statusCode);

    if (!Number.isInteger(value)) {
        return "default";
    }

    if (value >= 500) {
        return "error";
    }

    if (value >= 400) {
        return "warning";
    }

    if (value >= 300) {
        return "info";
    }

    if (value >= 200) {
        return "success";
    }

    return "default";
}

export function getSeverityColor(
    severity
) {
    const normalized =
        String(severity ?? "")
            .trim()
            .toLowerCase();

    const colors = {
        trace: "default",
        debug: "default",
        information: "info",
        info: "info",
        warning: "warning",
        error: "error",
        critical: "error",
    };

    return colors[normalized] ?? "default";
}

export function getStatusColor(
    status
) {
    const normalized =
        String(status ?? "")
            .trim()
            .toLowerCase();

    const colors = {
        success: "success",
        succeeded: "success",
        completed: "success",
        failure: "error",
        failed: "error",
        error: "error",
        pending: "warning",
        warning: "warning",
    };

    return colors[normalized] ?? "default";
}

export function getActionColor(
    action
) {
    const normalized =
        String(action ?? "")
            .trim()
            .toLowerCase();

    const colors = {
        create: "success",
        created: "success",
        update: "warning",
        updated: "warning",
        delete: "error",
        deleted: "error",
        login: "info",
        logout: "default",
        assign: "primary",
        approve: "success",
        reject: "error",
        export: "secondary",
        import: "primary",
    };

    return colors[normalized] ?? "default";
}

export function parseJsonValue(
    value
) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    if (
        typeof value === "object"
    ) {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export function formatJsonValue(
    value
) {
    const parsed = parseJsonValue(value);

    if (parsed === null) {
        return FALLBACK_TEXT;
    }

    if (typeof parsed === "string") {
        return parsed;
    }

    try {
        return JSON.stringify(
            parsed,
            null,
            2
        );
    } catch {
        return String(parsed);
    }
}

export function truncateText(
    value,
    maximumLength = 100
) {
    const text = getSafeText(value, "");

    if (!text) {
        return FALLBACK_TEXT;
    }

    if (text.length <= maximumLength) {
        return text;
    }

    return `${text.slice(
        0,
        Math.max(maximumLength - 1, 0)
    )}…`;
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

export function getBrowserName(
    userAgent
) {
    const value =
        String(userAgent ?? "");

    if (!value) {
        return FALLBACK_TEXT;
    }

    if (/Edg\//i.test(value)) {
        return "Microsoft Edge";
    }

    if (/OPR\//i.test(value)) {
        return "Opera";
    }

    if (/Chrome\//i.test(value)) {
        return "Google Chrome";
    }

    if (/Firefox\//i.test(value)) {
        return "Mozilla Firefox";
    }

    if (
        /Safari\//i.test(value) &&
        !/Chrome\//i.test(value)
    ) {
        return "Safari";
    }

    return "Unknown browser";
}

export function getDeviceType(
    userAgent
) {
    const value =
        String(userAgent ?? "");

    if (!value) {
        return FALLBACK_TEXT;
    }

    if (/tablet|ipad/i.test(value)) {
        return "Tablet";
    }

    if (
        /mobile|iphone|android/i.test(value)
    ) {
        return "Mobile";
    }

    return "Desktop";
}
