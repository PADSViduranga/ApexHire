import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import roleService from "../services/roleService";

import {
    DEFAULT_ROLE_FILTERS
} from "../utils/roleConstants";

import {
    getRoleStatistics,
    processRoles
} from "../utils/roleHelpers";

import {
    mapRolesFromApi
} from "../utils/roleMapper";

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Unable to load roles."
    );
}

function isCancelledRequest(error) {
    return (
        error?.name === "CanceledError" ||
        error?.name === "AbortError" ||
        error?.code === "ERR_CANCELED"
    );
}

export default function useRoles() {
    const controllerRef = useRef(null);

    const [roles, setRoles] =
        useState([]);

    const [filters, setFilters] =
        useState({
            ...DEFAULT_ROLE_FILTERS
        });

    const [selectedRole, setSelectedRole] =
        useState(null);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadRoles = useCallback(
        async ({
            refresh = false
        } = {}) => {
            controllerRef.current?.abort();

            const controller =
                new AbortController();

            controllerRef.current =
                controller;

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const response =
                    await roleService.getRoles({
                        signal:
                            controller.signal
                    });

                setRoles(
                    mapRolesFromApi(response)
                );
            } catch (requestError) {
                if (
                    !isCancelledRequest(
                        requestError
                    )
                ) {
                    setError(
                        getErrorMessage(
                            requestError
                        )
                    );
                }
            } finally {
                if (
                    controllerRef.current ===
                    controller
                ) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        []
    );

    useEffect(() => {
        loadRoles();

        return () => {
            controllerRef.current?.abort();
        };
    }, [loadRoles]);

    const visibleRoles = useMemo(
        () =>
            processRoles(
                roles,
                filters
            ),
        [
            roles,
            filters
        ]
    );

    const statistics = useMemo(
        () =>
            getRoleStatistics(roles),
        [roles]
    );

    const setSearch = useCallback(
        value => {
            setFilters(previous => ({
                ...previous,
                search:
                    String(value ?? "")
            }));
        },
        []
    );

    const setSortBy = useCallback(
        value => {
            setFilters(previous => ({
                ...previous,
                sortBy:
                    value ||
                    DEFAULT_ROLE_FILTERS.sortBy
            }));
        },
        []
    );

    const resetFilters = useCallback(
        () => {
            setFilters({
                ...DEFAULT_ROLE_FILTERS
            });
        },
        []
    );

    const openDetails = useCallback(
        role => {
            setSelectedRole(role);
            setDetailsOpen(true);
        },
        []
    );

    const closeDetails = useCallback(
        () => {
            setDetailsOpen(false);
            setSelectedRole(null);
        },
        []
    );

    return {
        roles,
        visibleRoles,
        statistics,
        filters,
        loading,
        refreshing,
        error,
        selectedRole,
        detailsOpen,

        setSearch,
        setSortBy,
        resetFilters,
        openDetails,
        closeDetails,

        refreshRoles: () =>
            loadRoles({
                refresh: true
            }),

        clearError: () =>
            setError("")
    };
}
