import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import auditLogService from "../services/auditLogService";
import {
    mapAuditLogDetails,
    mapAuditLogPagedResult,
} from "../utils/auditLogMapper";
import {
    normalizeDateForQuery,
} from "../utils/auditLogHelpers";

const DEFAULT_FILTERS = Object.freeze({
    search: "",
    userId: "",
    action: "",
    module: "",
    entityName: "",
    entityId: "",
    severity: "",
    status: "",
    fromDate: "",
    toDate: "",
});

const DEFAULT_PAGINATION = Object.freeze({
    pageNumber: 1,
    pageSize: 20,
});

const DEFAULT_SORTING = Object.freeze({
    sortBy: "createdAt",
    sortDirection: "desc",
});

const EMPTY_RESULT = Object.freeze({
    items: [],
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
});

function getErrorMessage(error) {
    if (error?.name === "CanceledError") {
        return "";
    }

    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Unable to load audit logs."
    );
}

export default function useAuditLogs() {
    const abortControllerRef =
        useRef(null);

    const requestIdRef =
        useRef(0);

    const [filters, setFilters] =
        useState(DEFAULT_FILTERS);

    const [pagination, setPagination] =
        useState(DEFAULT_PAGINATION);

    const [sorting, setSorting] =
        useState(DEFAULT_SORTING);

    const [result, setResult] =
        useState(EMPTY_RESULT);

    const [selectedAuditLog, setSelectedAuditLog] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [isDetailsLoading, setIsDetailsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [detailsError, setDetailsError] =
        useState("");

    const query = useMemo(
        () => ({
            pageNumber:
                pagination.pageNumber,

            pageSize:
                pagination.pageSize,

            search:
                filters.search.trim(),

            userId:
                filters.userId === ""
                    ? undefined
                    : Number(filters.userId),

            action:
                filters.action ||
                undefined,

            module:
                filters.module.trim() ||
                undefined,

            entityName:
                filters.entityName.trim() ||
                undefined,

            entityId:
                filters.entityId.trim() ||
                undefined,

            severity:
                filters.severity ||
                undefined,

            status:
                filters.status ||
                undefined,

            fromDate:
                normalizeDateForQuery(
                    filters.fromDate
                ),

            toDate:
                normalizeDateForQuery(
                    filters.toDate,
                    true
                ),

            sortBy:
                sorting.sortBy,

            sortDirection:
                sorting.sortDirection,
        }),
        [
            filters,
            pagination,
            sorting,
        ]
    );

    const loadAuditLogs =
        useCallback(
            async ({
                showRefreshIndicator = false,
            } = {}) => {
                abortControllerRef.current?.abort();

                const controller =
                    new AbortController();

                abortControllerRef.current =
                    controller;

                const requestId =
                    ++requestIdRef.current;

                if (showRefreshIndicator) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                setError("");

                try {
                    const response =
                        await auditLogService
                            .getAuditLogs(
                                query,
                                controller.signal
                            );

                    if (
                        requestId !==
                        requestIdRef.current
                    ) {
                        return;
                    }

                    const mappedResult =
                        mapAuditLogPagedResult(
                            response
                        );

                    setResult(mappedResult);

                    if (
                        mappedResult.totalPages > 0 &&
                        pagination.pageNumber >
                            mappedResult.totalPages
                    ) {
                        setPagination(
                            current => ({
                                ...current,
                                pageNumber:
                                    mappedResult.totalPages,
                            })
                        );
                    }
                } catch (requestError) {
                    if (
                        requestError?.name ===
                            "CanceledError" ||
                        controller.signal.aborted
                    ) {
                        return;
                    }

                    if (
                        requestId ===
                        requestIdRef.current
                    ) {
                        setError(
                            getErrorMessage(
                                requestError
                            )
                        );

                        setResult(current => ({
                            ...current,
                            items: [],
                            totalCount: 0,
                            totalPages: 0,
                            hasPreviousPage:
                                false,
                            hasNextPage:
                                false,
                        }));
                    }
                } finally {
                    if (
                        requestId ===
                        requestIdRef.current
                    ) {
                        setIsLoading(false);
                        setIsRefreshing(false);
                    }
                }
            },
            [
                query,
                pagination.pageNumber,
            ]
        );

    useEffect(() => {
        loadAuditLogs();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [loadAuditLogs]);

    const updateFilter =
        useCallback(
            (name, value) => {
                setFilters(current => ({
                    ...current,
                    [name]: value,
                }));

                setPagination(current => ({
                    ...current,
                    pageNumber: 1,
                }));
            },
            []
        );

    const updateFilters =
        useCallback(
            values => {
                setFilters(current => ({
                    ...current,
                    ...values,
                }));

                setPagination(current => ({
                    ...current,
                    pageNumber: 1,
                }));
            },
            []
        );

    const resetFilters =
        useCallback(() => {
            setFilters(DEFAULT_FILTERS);
            setPagination(
                DEFAULT_PAGINATION
            );
            setSorting(
                DEFAULT_SORTING
            );
        }, []);

    const changePage =
        useCallback(pageNumber => {
            setPagination(current => ({
                ...current,
                pageNumber:
                    Math.max(
                        Number(pageNumber) || 1,
                        1
                    ),
            }));
        }, []);

    const changePageSize =
        useCallback(pageSize => {
            setPagination({
                pageNumber: 1,
                pageSize:
                    Math.min(
                        Math.max(
                            Number(pageSize) ||
                                20,
                            1
                        ),
                        100
                    ),
            });
        }, []);

    const changeSorting =
        useCallback(
            sortBy => {
                setSorting(current => {
                    if (
                        current.sortBy ===
                        sortBy
                    ) {
                        return {
                            sortBy,
                            sortDirection:
                                current.sortDirection ===
                                "asc"
                                    ? "desc"
                                    : "asc",
                        };
                    }

                    return {
                        sortBy,
                        sortDirection:
                            "asc",
                    };
                });

                setPagination(current => ({
                    ...current,
                    pageNumber: 1,
                }));
            },
            []
        );

    const openAuditLogDetails =
        useCallback(
            async auditLog => {
                if (!auditLog?.id) {
                    return;
                }

                setSelectedAuditLog(
                    auditLog
                );

                setDetailsError("");
                setIsDetailsLoading(true);

                try {
                    const response =
                        await auditLogService
                            .getAuditLogById(
                                auditLog.id
                            );

                    setSelectedAuditLog(
                        mapAuditLogDetails(
                            response
                        )
                    );
                } catch (requestError) {
                    setDetailsError(
                        getErrorMessage(
                            requestError
                        )
                    );
                } finally {
                    setIsDetailsLoading(false);
                }
            },
            []
        );

    const closeAuditLogDetails =
        useCallback(() => {
            setSelectedAuditLog(null);
            setDetailsError("");
            setIsDetailsLoading(false);
        }, []);

    const refresh =
        useCallback(() => {
            return loadAuditLogs({
                showRefreshIndicator: true,
            });
        }, [loadAuditLogs]);

    const clearError =
        useCallback(() => {
            setError("");
        }, []);

    return {
        auditLogs:
            result.items,

        pagination: {
            pageNumber:
                result.pageNumber,
            pageSize:
                result.pageSize,
            totalCount:
                result.totalCount,
            totalPages:
                result.totalPages,
            hasPreviousPage:
                result.hasPreviousPage,
            hasNextPage:
                result.hasNextPage,
        },

        filters,
        sorting,

        selectedAuditLog,

        isLoading,
        isRefreshing,
        isDetailsLoading,

        error,
        detailsError,

        updateFilter,
        updateFilters,
        resetFilters,

        changePage,
        changePageSize,
        changeSorting,

        openAuditLogDetails,
        closeAuditLogDetails,

        refresh,
        clearError,
    };
}
