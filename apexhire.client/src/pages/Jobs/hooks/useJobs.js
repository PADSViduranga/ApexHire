import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import jobService from "../../../services/jobService";

const DEFAULT_PAGE_SIZE = 10;

function normalizeJobsResponse(result, requestedPage) {
    const responseData = result?.data;

    if (Array.isArray(responseData)) {
        return {
            items: responseData,
            page: requestedPage,
            pageSize: DEFAULT_PAGE_SIZE,
            totalItems: responseData.length,
            totalPages:
                responseData.length > 0 ? 1 : 0,
        };
    }

    const items = Array.isArray(responseData?.items)
        ? responseData.items
        : [];

    return {
        items,
        page:
            responseData?.page ??
            responseData?.currentPage ??
            requestedPage,
        pageSize:
            responseData?.pageSize ??
            DEFAULT_PAGE_SIZE,
        totalItems:
            responseData?.totalItems ??
            responseData?.totalCount ??
            items.length,
        totalPages:
            responseData?.totalPages ??
            responseData?.pageCount ??
            (items.length > 0 ? 1 : 0),
    };
}

export default function useJobs(filters = {}) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPageState] = useState(1);
    const [pageSize] = useState(
        DEFAULT_PAGE_SIZE
    );

    const [totalItems, setTotalItems] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const requestIdRef = useRef(0);

    const fetchJobs = useCallback(async () => {
        const currentRequestId =
            requestIdRef.current + 1;

        requestIdRef.current =
            currentRequestId;

        try {
            setLoading(true);
            setError("");

            const result =
                await jobService.searchJobs({
                    ...filters,
                    page,
                    pageSize,
                });

            if (
                currentRequestId !==
                requestIdRef.current
            ) {
                return;
            }

            if (result?.success === false) {
                setJobs([]);
                setTotalItems(0);
                setTotalPages(0);

                setError(
                    result.message ||
                    "Unable to load jobs."
                );

                return;
            }

            const normalized =
                normalizeJobsResponse(
                    result,
                    page
                );

            setJobs(normalized.items);
            setTotalItems(
                normalized.totalItems
            );
            setTotalPages(
                normalized.totalPages
            );
        } catch (requestError) {
            if (
                currentRequestId !==
                requestIdRef.current
            ) {
                return;
            }

            console.error(
                "Failed to load jobs:",
                requestError
            );

            setJobs([]);
            setTotalItems(0);
            setTotalPages(0);

            setError(
                requestError.response?.data
                    ?.message ||
                requestError.response?.data
                    ?.error ||
                requestError.message ||
                "Unable to connect to the jobs service."
            );
        } finally {
            if (
                currentRequestId ===
                requestIdRef.current
            ) {
                setLoading(false);
            }
        }
    }, [filters, page, pageSize]);

    useEffect(() => {
        setPageState(1);
    }, [filters]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    function setPage(nextPage) {
        const parsedPage =
            Number(nextPage);

        if (
            !Number.isInteger(parsedPage) ||
            parsedPage < 1
        ) {
            return;
        }

        if (
            totalPages > 0 &&
            parsedPage > totalPages
        ) {
            return;
        }

        setPageState(parsedPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return {
        jobs,
        loading,
        error,
        page,
        pageSize,
        totalItems,
        totalPages,
        setPage,
        refetch: fetchJobs,
    };
}