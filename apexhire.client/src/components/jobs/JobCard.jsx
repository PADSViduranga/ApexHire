import { Link, useNavigate } from "react-router-dom";

import Badge from "../common/Badge";
import Button from "../common/Button";
import {
    ArrowRight,
    Bookmark,
    MapPin,
} from "../common/Icons";

import "./JobCard.css";

function formatSalary(minSalary, maxSalary) {
    if (!minSalary && !maxSalary) {
        return "Salary not specified";
    }

    const formatter = new Intl.NumberFormat("en-LK");

    if (minSalary && maxSalary) {
        return `LKR ${formatter.format(minSalary)} - ${formatter.format(
            maxSalary
        )}`;
    }

    return `LKR ${formatter.format(minSalary || maxSalary)}`;
}

function getCompanyInitials(companyName) {
    if (!companyName) {
        return "AH";
    }

    return companyName
        .split(" ")
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

function getEmploymentBadgeVariant(employmentType) {
    switch (employmentType?.toLowerCase()) {
        case "full time":
            return "primary";

        case "part time":
            return "warning";

        case "contract":
            return "accent";

        case "internship":
            return "success";

        default:
            return "default";
    }
}

function getWorkModeBadgeVariant(workMode) {
    switch (workMode?.toLowerCase()) {
        case "remote":
            return "success";

        case "hybrid":
            return "info";

        case "on-site":
            return "neutral";

        default:
            return "default";
    }
}

export default function JobCard({ job }) {
    const navigate = useNavigate();

    const {
        id,
        title,
        company,
        location,
        employmentType,
        workMode,
        salaryMin,
        salaryMax,
        postedDate,
        logo,
    } = job;

    function handleApply() {
        navigate(`/jobs/${id}`);
    }

    function handleSaveJob() {
        console.log(`Save job ${id}`);
    }

    return (
        <article className="job-card">
            <div className="job-card__top">
                <div className="job-card__company">
                    <div className="job-card__logo">
                        {logo ? (
                            <img
                                src={logo}
                                alt={`${company} logo`}
                            />
                        ) : (
                            <span aria-hidden="true">
                                {getCompanyInitials(company)}
                            </span>
                        )}
                    </div>

                    <div>
                        <p className="job-card__company-name">
                            {company}
                        </p>

                        <p className="job-card__posted-date">
                            {postedDate}
                        </p>
                    </div>
                </div>

                <button
                    className="job-card__save"
                    type="button"
                    aria-label={`Save ${title}`}
                    onClick={handleSaveJob}
                >
                    <Bookmark
                        size={20}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </button>
            </div>

            <div className="job-card__content">
                <h3 className="job-card__title">
                    <Link to={`/jobs/${id}`}>
                        {title}
                    </Link>
                </h3>

                <div className="job-card__details">
                    <Badge variant="default">
                        <MapPin
                            size={13}
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        {location}
                    </Badge>

                    <Badge
                        variant={getEmploymentBadgeVariant(
                            employmentType
                        )}
                    >
                        {employmentType}
                    </Badge>

                    {workMode && (
                        <Badge
                            variant={getWorkModeBadgeVariant(workMode)}
                        >
                            {workMode}
                        </Badge>
                    )}
                </div>

                <p className="job-card__salary">
                    {formatSalary(salaryMin, salaryMax)}
                </p>
            </div>

            <div className="job-card__footer">
                <Link
                    className="job-card__details-link"
                    to={`/jobs/${id}`}
                >
                    View Details
                </Link>

                <Button
                    size="sm"
                    variant="primary"
                    rightIcon={
                        <ArrowRight
                            size={17}
                            strokeWidth={2}
                        />
                    }
                    onClick={handleApply}
                >
                    Apply Now
                </Button>
            </div>
        </article>
    );
}