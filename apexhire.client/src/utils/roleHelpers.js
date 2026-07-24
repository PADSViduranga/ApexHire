import {
    ROLE_COLORS,
    ROLE_DESCRIPTIONS
} from "./roleConstants";

export function normalizeRoleKey(value) {
    const normalized = String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

    if (
        normalized === "administrator" ||
        normalized === "administrative"
    ) {
        return "admin";
    }

    return normalized;
}

export function formatRoleName(role) {
    const value =
        role?.displayName ??
        role?.name ??
        "Unknown Role";

    return String(value).trim() || "Unknown Role";
}

export function getRoleDescription(role) {
    const key = normalizeRoleKey(
        role?.name ??
        role?.displayName
    );

    return (
        ROLE_DESCRIPTIONS[key] ??
        "System role used to control access and responsibilities."
    );
}

export function getRoleColor(role) {
    const key = normalizeRoleKey(
        role?.name ??
        role?.displayName
    );

    return ROLE_COLORS[key] ?? "default";
}

export function getRoleInitials(role) {
    const name = formatRoleName(role);

    const words = name
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "R";
    }

    if (words.length === 1) {
        return words[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return words
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase();
}

export function filterRoles(
    roles,
    searchTerm
) {
    const query = String(searchTerm ?? "")
        .trim()
        .toLowerCase();

    if (!query) {
        return roles;
    }

    return roles.filter(role =>
        role.name.toLowerCase().includes(query) ||
        role.displayName.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query) ||
        String(role.value).includes(query)
    );
}

export function sortRoles(
    roles,
    sortBy = "value"
) {
    const sorted = [...roles];

    sorted.sort((first, second) => {
        if (sortBy === "name") {
            return first.name.localeCompare(
                second.name,
                undefined,
                {
                    sensitivity: "base"
                }
            );
        }

        if (sortBy === "displayName") {
            return first.displayName.localeCompare(
                second.displayName,
                undefined,
                {
                    sensitivity: "base"
                }
            );
        }

        return first.value - second.value;
    });

    return sorted;
}

export function processRoles(
    roles,
    filters
) {
    const safeRoles = Array.isArray(roles)
        ? roles
        : [];

    const filtered = filterRoles(
        safeRoles,
        filters?.search
    );

    return sortRoles(
        filtered,
        filters?.sortBy
    );
}

export function getRoleStatistics(roles) {
    const safeRoles = Array.isArray(roles)
        ? roles
        : [];

    const roleKeys = safeRoles.map(role =>
        normalizeRoleKey(
            role.name ??
            role.displayName
        )
    );

    return {
        totalRoles: safeRoles.length,

        candidateRoles:
            roleKeys.filter(
                key => key === "candidate"
            ).length,

        staffRoles:
            roleKeys.filter(
                key =>
                    key === "recruiter" ||
                    key === "hiringmanager"
            ).length,

        administrativeRoles:
            roleKeys.filter(
                key => key === "admin"
            ).length
    };
}

export function normalizeRoleName(role) {
    return formatRoleName(role);
}
