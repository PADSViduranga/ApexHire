import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";
import {
    ArrowRight,
    Briefcase,
    Building2,
    Star,
} from "../common/Icons";
import SectionHeader from "../common/SectionHeader";

import "./FeaturedCompanies.css";

const companies = [
    {
        id: 1,
        name: "Dialog Axiata",
        industry: "Telecommunications",
        openJobs: 24,
        rating: 4.8,
        logo: null,
    },
    {
        id: 2,
        name: "Virtusa",
        industry: "Information Technology",
        openJobs: 18,
        rating: 4.7,
        logo: null,
    },
    {
        id: 3,
        name: "MAS Holdings",
        industry: "Apparel & Manufacturing",
        openJobs: 15,
        rating: 4.6,
        logo: null,
    },
    {
        id: 4,
        name: "John Keells Holdings",
        industry: "Diversified Holdings",
        openJobs: 21,
        rating: 4.9,
        logo: null,
    },
    {
        id: 5,
        name: "WSO2",
        industry: "Software Development",
        openJobs: 12,
        rating: 4.8,
        logo: null,
    },
    {
        id: 6,
        name: "Commercial Bank",
        industry: "Banking & Finance",
        openJobs: 10,
        rating: 4.7,
        logo: null,
    },
];

function getCompanyInitials(companyName) {
    return companyName
        .split(" ")
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

export default function FeaturedCompanies() {
    const navigate = useNavigate();

    function handleViewCompany(companyId) {
        navigate(`/jobs?companyId=${companyId}`);
    }

    function handleViewAllCompanies() {
        navigate("/companies");
    }

    return (
        <section className="featured-companies">
            <Container>
                <SectionHeader
                    eyebrow="Top Employers"
                    title="Featured Companies Hiring Now"
                    description="Discover trusted organizations offering exciting career opportunities across Sri Lanka."
                    align="left"
                    actions={
                        <Button
                            variant="outline"
                            rightIcon={
                                <ArrowRight
                                    size={18}
                                    strokeWidth={2}
                                />
                            }
                            onClick={handleViewAllCompanies}
                        >
                            View All Companies
                        </Button>
                    }
                />

                <div className="featured-companies__grid">
                    {companies.map((company) => (
                        <article
                            key={company.id}
                            className="company-card"
                        >
                            <div className="company-card__header">
                                <div className="company-card__logo">
                                    {company.logo ? (
                                        <img
                                            src={company.logo}
                                            alt={`${company.name} logo`}
                                        />
                                    ) : (
                                        <span aria-hidden="true">
                                            {getCompanyInitials(company.name)}
                                        </span>
                                    )}
                                </div>

                                <div className="company-card__rating">
                                    <Star
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    <span>{company.rating}</span>
                                </div>
                            </div>

                            <div className="company-card__content">
                                <h3>{company.name}</h3>

                                <p className="company-card__industry">
                                    <Building2
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    <span>{company.industry}</span>
                                </p>

                                <p className="company-card__jobs">
                                    <Briefcase
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {company.openJobs} open jobs
                                    </span>
                                </p>
                            </div>

                            <div className="company-card__footer">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    rightIcon={
                                        <ArrowRight
                                            size={17}
                                            strokeWidth={2}
                                        />
                                    }
                                    onClick={() =>
                                        handleViewCompany(company.id)
                                    }
                                >
                                    View Jobs
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
}