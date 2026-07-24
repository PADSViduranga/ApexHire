import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import adminService from "../services/adminService";

import useDepartmentDialogs
    from "./useDepartmentDialogs";

import useDepartmentFilters
    from "./useDepartmentFilters";

import useDepartmentValidation
    from "./useDepartmentValidation";

function normalizeList(response, keys = []) {
    const payload =
        response?.data ??
        response ??
        {};

    if (Array.isArray(payload)) {
        return payload;
    }

    for (const key of keys) {
        if (Array.isArray(payload[key])) {
            return payload[key];
        }
    }

    if (Array.isArray(payload.items)) {
        return payload.items;
    }

    if (Array.isArray(payload.data)) {
        return payload.data;
    }

    return [];
}

function normalizeDepartments(response) {
    const payload =
        response?.data ??
        response ??
        {};

    const items =
        payload.items ??
        payload.departments ??
        payload.results ??
        payload.data ??
        (
            Array.isArray(payload)
                ? payload
                : []
        );

    const total =
        payload.totalCount ??
        payload.total ??
        payload.count ??
        (
            Array.isArray(items)
                ? items.length
                : 0
        );

    return {
        items:
            Array.isArray(items)
                ? items
                : [],

        total:
            Number.isFinite(
                Number(total)
            )
                ? Number(total)
                : 0
    };
}

function getErrorMessage(
    error,
    fallback
) {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.title ??
        error?.response?.data ??
        error?.message ??
        fallback
    );
}

function calculateStatistics(
    departments
) {
    const active =
        departments.filter(
            department =>
                department.isActive !== false
        ).length;

    const inactive =
        departments.length -
        active;

    const withOrganization =
        departments.filter(
            department =>
                Boolean(
                    department.organizationId ??
                    department.organization?.id
                )
        ).length;

    return {
        total:
            departments.length,

        active,

        inactive,

        withOrganization
    };
}

export function useDepartments() {
    const mountedRef =
        useRef(true);

    const requestIdRef =
        useRef(0);

    const [
        departments,
        setDepartments
    ] = useState([]);

    const [
        organizations,
        setOrganizations
    ] = useState([]);

    const [
        totalRows,
        setTotalRows
    ] = useState(0);

    const [
        error,
        setError
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState({
        initial: true,
        table: false,
        saving: false,
        deleting: false
    });

    const filterState =
        useDepartmentFilters();

    const dialogState =
        useDepartmentDialogs();

    const validationState =
        useDepartmentValidation();

    const fetchOrganizations =
        useCallback(async () => {
            try {
                const response =
                    await adminService
                        .getOrganizations();

                if (!mountedRef.current) {
                    return;
                }

                setOrganizations(
                    normalizeList(
                        response,
                        [
                            "organizations"
                        ]
                    )
                );
            } catch (requestError) {
                if (!mountedRef.current) {
                    return;
                }

                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to load organizations."
                    )
                );
            }
        }, []);

    const fetchDepartments =
        useCallback(async () => {
            const requestId =
                ++requestIdRef.current;

            setLoading(
                previous => ({
                    ...previous,
                    table: true
                })
            );

            setError("");

            try {
                const response =
                    await adminService
                        .getDepartments(
                            filterState.query
                        );

                if (
                    !mountedRef.current ||
                    requestId !==
                        requestIdRef.current
                ) {
                    return;
                }

                const normalized =
                    normalizeDepartments(
                        response
                    );

                setDepartments(
                    normalized.items
                );

                setTotalRows(
                    normalized.total
                );
            } catch (requestError) {
                if (
                    !mountedRef.current ||
                    requestId !==
                        requestIdRef.current
                ) {
                    return;
                }

                setDepartments([]);
                setTotalRows(0);

                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to load departments."
                    )
                );
            } finally {
                if (
                    mountedRef.current &&
                    requestId ===
                        requestIdRef.current
                ) {
                    setLoading(
                        previous => ({
                            ...previous,
                            table: false,
                            initial: false
                        })
                    );
                }
            }
        }, [
            filterState.query
        ]);

    useEffect(() => {
        mountedRef.current = true;

        Promise.all([
            fetchOrganizations(),
            fetchDepartments()
        ]).finally(() => {
            if (mountedRef.current) {
                setLoading(
                    previous => ({
                        ...previous,
                        initial: false
                    })
                );
            }
        });

        return () => {
            mountedRef.current = false;
            requestIdRef.current += 1;
        };
    }, [
        fetchOrganizations,
        fetchDepartments
    ]);

    const createDepartment =
        useCallback(
            async values => {
                const result =
                    await validationState
                        .validate(values);

                if (!result.isValid) {
                    return false;
                }

                setLoading(
                    previous => ({
                        ...previous,
                        saving: true
                    })
                );

                setError("");

                try {
                    await adminService
                        .createDepartment(
                            values
                        );

                    if (!mountedRef.current) {
                        return false;
                    }

                    dialogState
                        .closeFormDialog();

                    validationState
                        .clearErrors();

                    await fetchDepartments();

                    return true;
                } catch (requestError) {
                    if (mountedRef.current) {
                        setError(
                            getErrorMessage(
                                requestError,
                                "Unable to create department."
                            )
                        );
                    }

                    return false;
                } finally {
                    if (mountedRef.current) {
                        setLoading(
                            previous => ({
                                ...previous,
                                saving: false
                            })
                        );
                    }
                }
            },
            [
                validationState,
                dialogState,
                fetchDepartments
            ]
        );

    const updateDepartment =
        useCallback(
            async values => {
                const departmentId =
                    dialogState
                        .selectedDepartment
                        ?.id ??
                    values?.id;

                if (!departmentId) {
                    setError(
                        "Department ID is missing."
                    );

                    return false;
                }

                const result =
                    await validationState
                        .validate(values);

                if (!result.isValid) {
                    return false;
                }

                setLoading(
                    previous => ({
                        ...previous,
                        saving: true
                    })
                );

                setError("");

                try {
                    await adminService
                        .updateDepartment(
                            departmentId,
                            values
                        );

                    if (!mountedRef.current) {
                        return false;
                    }

                    dialogState
                        .closeFormDialog();

                    validationState
                        .clearErrors();

                    await fetchDepartments();

                    return true;
                } catch (requestError) {
                    if (mountedRef.current) {
                        setError(
                            getErrorMessage(
                                requestError,
                                "Unable to update department."
                            )
                        );
                    }

                    return false;
                } finally {
                    if (mountedRef.current) {
                        setLoading(
                            previous => ({
                                ...previous,
                                saving: false
                            })
                        );
                    }
                }
            },
            [
                validationState,
                dialogState,
                fetchDepartments
            ]
        );

    const deleteDepartment =
        useCallback(async () => {
            const departmentId =
                dialogState
                    .selectedDepartment
                    ?.id;

            if (!departmentId) {
                setError(
                    "Department ID is missing."
                );

                return false;
            }

            setLoading(
                previous => ({
                    ...previous,
                    deleting: true
                })
            );

            setError("");

            try {
                await adminService
                    .deleteDepartment(
                        departmentId
                    );

                if (!mountedRef.current) {
                    return false;
                }

                dialogState
                    .closeDeleteDialog();

                if (
                    departments.length === 1 &&
                    filterState.page > 0
                ) {
                    filterState.updatePage(
                        filterState.page - 1
                    );
                } else {
                    await fetchDepartments();
                }

                return true;
            } catch (requestError) {
                if (mountedRef.current) {
                    setError(
                        getErrorMessage(
                            requestError,
                            "Unable to delete department."
                        )
                    );
                }

                return false;
            } finally {
                if (mountedRef.current) {
                    setLoading(
                        previous => ({
                            ...previous,
                            deleting: false
                        })
                    );
                }
            }
        }, [
            dialogState,
            departments.length,
            filterState,
            fetchDepartments
        ]);

    const statistics =
        useMemo(
            () =>
                calculateStatistics(
                    departments
                ),
            [
                departments
            ]
        );

    const filters =
        useMemo(
            () => ({
                ...filterState.filters,

                page:
                    filterState.page,

                pageSize:
                    filterState.pageSize,

                sortModel:
                    filterState.sortModel,

                totalRows,

                setPage:
                    filterState.updatePage,

                setPageSize:
                    filterState.updatePageSize,

                setSortModel:
                    filterState.updateSortModel,

                updateFilters:
                    filterState.updateFilters,

                clearFilters:
                    filterState.clearFilters
            }),
            [
                filterState,
                totalRows
            ]
        );

    const dialogs =
        useMemo(
            () => ({
                form: {
                    open:
                        dialogState
                            .dialogs
                            .form,

                    editMode:
                        dialogState
                            .editMode,

                    department:
                        dialogState
                            .selectedDepartment
                },

                delete: {
                    open:
                        dialogState
                            .dialogs
                            .delete,

                    department:
                        dialogState
                            .selectedDepartment
                },

                details: {
                    open:
                        dialogState
                            .dialogs
                            .details,

                    department:
                        dialogState
                            .selectedDepartment
                },

                openCreateDialog:
                    dialogState
                        .openCreateDialog,

                openEditDialog:
                    dialogState
                        .openEditDialog,

                openDeleteDialog:
                    dialogState
                        .openDeleteDialog,

                openViewDialog:
                    dialogState
                        .openDetailsDialog,

                closeFormDialog:
                    dialogState
                        .closeFormDialog,

                closeDeleteDialog:
                    dialogState
                        .closeDeleteDialog,

                closeDetailsDialog:
                    dialogState
                        .closeDetailsDialog
            }),
            [
                dialogState
            ]
        );

    const validation =
        useMemo(
            () => ({
                ...validationState,
                error
            }),
            [
                validationState,
                error
            ]
        );

    return {
        loading,
        departments,
        organizations,
        statistics,
        filters,
        dialogs,
        validation,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment
    };
}

export default useDepartments;
