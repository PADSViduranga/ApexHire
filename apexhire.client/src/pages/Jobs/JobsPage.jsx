import {
    useMemo,
    useState,
} from "react";

import Container from "../../components/common/Container";
import PageHeader from "../../components/ui/PageHeader";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";

import JobFilters from "./components/JobFilters";
import JobGrid from "./components/JobGrid";
import useJobs from "./hooks/useJobs";

import "./JobsPage.css";

const initialFilters = {
    location: "",
    employmentType: "",
    minimumSalary: "",
    maximumSalary: "",
    organizationId: "",
};

export default function JobsPage() {
    const [search, setSearch] =
        useState("");

    const [filters, setFilters] =
        useState(initialFilters);

    const requestFilters = useMemo(
        () => ({
            title: search,
            location: filters.location,
            employmentType:
                filters.employmentType,
            minimumSalary:
                filters.minimumSalary,
            maximumSalary:
                filters.maximumSalary,
            organizationId:
                filters.organizationId,
        }),
        [search, filters]
    );

    const {
        jobs,
        loading,
        error,
        page,
        totalItems,
        totalPages,
        setPage,
        refetch,
    } = useJobs(requestFilters);

    function handleFilterChange(
        name,
        value
    ) {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    }

    function handleClearFilters() {
        setSearch("");
        setFilters({
            ...initialFilters,
        });
    }

    return (
        <Container>
            <PageHeader
                title="Find Your Dream Job"
                subtitle="Discover career opportunities from trusted employers."
            />

            <section className="jobs-toolbar">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    onClear={() =>
                        setSearch("")
                    }
                    placeholder="Search by job title..."
                />
            </section>

            <section className="jobs-layout">
                <aside className="jobs-sidebar">
                    <JobFilters
                        filters={filters}
                        onChange={
                            handleFilterChange
                        }
                        onReset={
                            handleClearFilters
                        }
                    />
                </aside>

                <div className="jobs-content">
                    <div className="jobs-results-header">
                        <p>
                            <strong>
                                {totalItems}
                            </strong>{" "}
                            {totalItems === 1
                                ? "job"
                                : "jobs"}{" "}
                            found
                        </p>
                    </div>

                    <JobGrid
                        jobs={jobs}
                        loading={loading}
                        error={error}
                        onClearFilters={
                            handleClearFilters
                        }
                        onRetry={refetch}
                    />

                    {!loading &&
                        !error &&
                        jobs.length > 0 && (
                            <Pagination
                                currentPage={
                                    page
                                }
                                totalPages={
                                    totalPages
                                }
                                onPageChange={
                                    setPage
                                }
                            />
                        )}
                </div>
            </section>
        </Container>
    );
}