import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import adminAnalyticsService from "../services/adminAnalyticsService";

import {
    DEFAULT_ANALYTICS_FILTERS,
    EMPTY_ANALYTICS_DATA,
} from "../utils/adminAnalyticsConstants";

import {
    buildAnalyticsQuery,
    validateCustomDateRange,
} from "../utils/adminAnalyticsHelpers";

import {
    mapAdminAnalytics,
} from "../utils/adminAnalyticsMapper";

function getErrorMessage(error) {
    if (
        error?.name === "CanceledError" ||
        error?.code === "ERR_CANCELED"
    ) {
        return "";
    }

    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Unable to load analytics data."
    );
}

export default function useAdminAnalytics() {
    const abortControllerRef =
        useRef(null);

    const requestIdRef =
        useRef(0);

    const [filters, setFilters] =
        useState({
            ...DEFAULT_ANALYTICS_FILTERS,
        });

    const [analyticsData, setAnalyticsData] =
        useState({
            ...EMPTY_ANALYTICS_DATA,
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const query = useMemo(
        () => buildAnalyticsQuery(filters),
        [filters]
    );

    const loadAnalytics =
        useCallback(
            async ({
                showRefreshIndicator = false,
            } = {}) => {
                const validationError =
                    validateCustomDateRange(
                        filters
                    );

                if (validationError) {
                    setError(validationError);
                    setIsLoading(false);
                    setIsRefreshing(false);
                    return;
                }

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
                        await adminAnalyticsService
                            .getAnalytics(
                                query,
                                controller.signal
                            );

                    if (
                        requestId !==
                        requestIdRef.current
                    ) {
                        return;
                    }

                    setAnalyticsData(
                        mapAdminAnalytics(response)
                    );
                } catch (requestError) {
                    if (
                        controller.signal.aborted ||
                        requestError?.name ===
                            "CanceledError" ||
                        requestError?.code ===
                            "ERR_CANCELED"
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

                        setAnalyticsData({
                            ...EMPTY_ANALYTICS_DATA,
                        });
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
                filters,
                query,
            ]
        );

    useEffect(() => {
        loadAnalytics();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [loadAnalytics]);

    const updateFilter =
        useCallback(
            (name, value) => {
                setFilters(current => {
                    const updated = {
                        ...current,
                        [name]: value,
                    };

                    if (
                        name === "period" &&
                        value !== "custom"
                    ) {
                        updated.fromDate = "";
                        updated.toDate = "";
                    }

                    return updated;
                });

                setError("");
            },
            []
        );

    const updateFilters =
        useCallback(values => {
            setFilters(current => ({
                ...current,
                ...values,
            }));

            setError("");
        }, []);

    const resetFilters =
        useCallback(() => {
            setFilters({
                ...DEFAULT_ANALYTICS_FILTERS,
            });

            setError("");
        }, []);

    const refreshAnalytics =
        useCallback(() => {
            return loadAnalytics({
                showRefreshIndicator: true,
            });
        }, [loadAnalytics]);

    const clearError =
        useCallback(() => {
            setError("");
        }, []);

    return {
        analyticsData,
        filters,
        query,

        isLoading,
        isRefreshing,
        error,

        updateFilter,
        updateFilters,
        resetFilters,

        refreshAnalytics,
        clearError,
    };
}
