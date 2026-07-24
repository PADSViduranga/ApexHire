import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import adminReportService from "../services/adminReportService";

import {
    DEFAULT_REPORT_FILTERS,
    EMPTY_REPORT_DATA,
} from "../utils/adminReportConstants";

import {
    buildReportQuery,
    validateCustomDateRange,
} from "../utils/adminReportHelpers";

import {
    mapAdminReport,
} from "../utils/adminReportMapper";

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
        "Unable to load admin reports."
    );
}

export default function useAdminReports() {
    const abortControllerRef =
        useRef(null);

    const requestIdRef =
        useRef(0);

    const [filters, setFilters] =
        useState({
            ...DEFAULT_REPORT_FILTERS,
        });

    const [reportData, setReportData] =
        useState({
            ...EMPTY_REPORT_DATA,
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [isExporting, setIsExporting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [exportError, setExportError] =
        useState("");

    const query = useMemo(
        () => buildReportQuery(filters),
        [filters]
    );

    const loadReports =
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
                        await adminReportService
                            .getReports(
                                query,
                                controller.signal
                            );

                    if (
                        requestId !==
                        requestIdRef.current
                    ) {
                        return;
                    }

                    setReportData(
                        mapAdminReport(response)
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

                        setReportData({
                            ...EMPTY_REPORT_DATA,
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
        loadReports();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [loadReports]);

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
                setExportError("");
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
            setExportError("");
        }, []);

    const resetFilters =
        useCallback(() => {
            setFilters({
                ...DEFAULT_REPORT_FILTERS,
            });

            setError("");
            setExportError("");
        }, []);

    const refreshReports =
        useCallback(() => {
            return loadReports({
                showRefreshIndicator: true,
            });
        }, [loadReports]);

    const exportReport =
        useCallback(
            async format => {
                const validationError =
                    validateCustomDateRange(
                        filters
                    );

                if (validationError) {
                    setExportError(
                        validationError
                    );
                    return false;
                }

                setIsExporting(true);
                setExportError("");

                try {
                    await adminReportService
                        .exportReport(
                            format,
                            query
                        );

                    return true;
                } catch (requestError) {
                    setExportError(
                        getErrorMessage(
                            requestError
                        ) ||
                            "Unable to export the report."
                    );

                    return false;
                } finally {
                    setIsExporting(false);
                }
            },
            [
                filters,
                query,
            ]
        );

    const clearError =
        useCallback(() => {
            setError("");
        }, []);

    const clearExportError =
        useCallback(() => {
            setExportError("");
        }, []);

    return {
        reportData,
        filters,
        query,

        isLoading,
        isRefreshing,
        isExporting,

        error,
        exportError,

        updateFilter,
        updateFilters,
        resetFilters,

        refreshReports,
        exportReport,

        clearError,
        clearExportError,
    };
}
