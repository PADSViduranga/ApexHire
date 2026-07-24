import Button from "../common/Button";

import "./Pagination.css";

function createPageNumbers(
    currentPage,
    totalPages
) {
    if (totalPages <= 7) {
        return Array.from(
            {
                length: totalPages,
            },
            (_, index) => index + 1
        );
    }

    const pages = [1];

    const startPage = Math.max(
        2,
        currentPage - 1
    );

    const endPage = Math.min(
        totalPages - 1,
        currentPage + 1
    );

    if (startPage > 2) {
        pages.push("start-ellipsis");
    }

    for (
        let page = startPage;
        page <= endPage;
        page += 1
    ) {
        pages.push(page);
    }

    if (endPage < totalPages - 1) {
        pages.push("end-ellipsis");
    }

    pages.push(totalPages);

    return pages;
}

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = createPageNumbers(
        currentPage,
        totalPages
    );

    return (
        <nav
            className="pagination"
            aria-label="Job results pagination"
        >
            <Button
                type="button"
                variant="outline"
                disabled={
                    currentPage <= 1
                }
                onClick={() =>
                    onPageChange(
                        currentPage - 1
                    )
                }
            >
                Previous
            </Button>

            <div className="pagination__pages">
                {pages.map((page) => {
                    if (
                        typeof page ===
                        "string"
                    ) {
                        return (
                            <span
                                key={page}
                                className="pagination__ellipsis"
                                aria-hidden="true"
                            >
                                …
                            </span>
                        );
                    }

                    const isActive =
                        currentPage === page;

                    return (
                        <button
                            key={page}
                            type="button"
                            className={`pagination__page ${isActive
                                    ? "active"
                                    : ""
                                }`}
                            aria-current={
                                isActive
                                    ? "page"
                                    : undefined
                            }
                            aria-label={`Go to page ${page}`}
                            onClick={() =>
                                onPageChange(
                                    page
                                )
                            }
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <Button
                type="button"
                variant="outline"
                disabled={
                    currentPage >=
                    totalPages
                }
                onClick={() =>
                    onPageChange(
                        currentPage + 1
                    )
                }
            >
                Next
            </Button>
        </nav>
    );
}