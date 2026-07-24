import {
    formatRoleName,
    getRoleColor,
    getRoleDescription,
    getRoleInitials
} from "./roleHelpers";

export function mapRoleFromApi(role) {
    const value = Number(role?.value);

    return {
        value,
        name: String(role?.name ?? "").trim(),
        displayName: formatRoleName(role),
        description: getRoleDescription(role),
        color: getRoleColor(role),
        initials: getRoleInitials(role)
    };
}

export function mapRolesFromApi(roles) {
    if (!Array.isArray(roles)) {
        return [];
    }

    return roles
        .map(mapRoleFromApi)
        .filter(role =>
            Number.isFinite(role.value) &&
            Boolean(role.name)
        );
}
