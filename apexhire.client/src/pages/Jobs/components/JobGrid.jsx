import EmptyState from "../../../components/ui/EmptyState";
import Skeleton from "../../../components/ui/Skeleton";

import JobCard from "../../../components/jobs/JobCard";

export default function JobGrid({
    jobs = [],
    loading,
    error,
    onClearFilters,
    onRetry,
}) {
    if (loading) {
        return (
            <div className="jobs-grid">
                {Array.from({
                    length: 6,
                }).map((_, index) => (
                    <Skeleton
                        key={`job-skeleton-${index}`}
                        variant="job"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <EmptyState
                title="Unable to load jobs"
                description={error}
                actionLabel="Try Again"
                onAction={onRetry}
            />
        );
    }

    if (jobs.length === 0) {
        return (
            <EmptyState
                title="No jobs found"
                description="Try changing your search terms or removing some filters."
                actionLabel="Clear Filters"
                onAction={
                    onClearFilters
                }
            />
        );
    }

    return (
        <div className="jobs-grid">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                />
            ))}
        </div>
    );
}