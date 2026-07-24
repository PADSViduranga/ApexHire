import axiosClient from "../api/axiosClient";

const ROLE_ENDPOINT = "/api/admin/roles";

function extractResponseData(response) {
    const payload = response?.data;

    if (payload?.success === false) {
        throw new Error(
            payload.message ||
            "Unable to complete the role request."
        );
    }

    return payload?.data ?? payload;
}

function normalizeRole(role) {
    return {
        value: Number(role?.value ?? 0),
        name: String(role?.name ?? "").trim(),
        displayName: String(
            role?.displayName ??
            role?.name ??
            ""
        ).trim()
    };
}

async function getRoles(options = {}) {
    const {
        signal
    } = options;

    const response = await axiosClient.get(
        ROLE_ENDPOINT,
        {
            signal
        }
    );

    const data = extractResponseData(response);

    const roles = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
            ? data.items
            : [];

    return roles
        .map(normalizeRole)
        .filter(role =>
            role.name &&
            role.displayName
        );
}

async function getRoleByValue(
    value,
    options = {}
) {
    const roles = await getRoles(options);

    const numericValue = Number(value);

    const role = roles.find(
        item =>
            item.value === numericValue
    );

    if (!role) {
        throw new Error(
            "Role not found."
        );
    }

    return role;
}

async function getRoleByName(
    name,
    options = {}
) {
    const roles = await getRoles(options);

    const normalizedName = String(
        name ?? ""
    )
        .trim()
        .toLowerCase();

    const role = roles.find(
        item =>
            item.name
                .toLowerCase() ===
            normalizedName
    );

    if (!role) {
        throw new Error(
            "Role not found."
        );
    }

    return role;
}

async function searchRoles(
    searchTerm,
    options = {}
) {
    const roles = await getRoles(options);

    const query = String(
        searchTerm ?? ""
    )
        .trim()
        .toLowerCase();

    if (!query) {
        return roles;
    }

    return roles.filter(role =>
        role.name
            .toLowerCase()
            .includes(query) ||
        role.displayName
            .toLowerCase()
            .includes(query) ||
        String(role.value)
            .includes(query)
    );
}

const roleService = {
    getRoles,
    getRoleByValue,
    getRoleByName,
    searchRoles
};

export {
    getRoles,
    getRoleByValue,
    getRoleByName,
    searchRoles
};

export default roleService;
