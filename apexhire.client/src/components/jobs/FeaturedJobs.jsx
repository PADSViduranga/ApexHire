import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import JobCard from "./JobCard";

import "./FeaturedJobs.css";

const featuredJobs = [
    {
        id: 1,
        title: "Senior Software Engineer",
        company: "Lanka Digital Solutions",
        location: "Colombo",
        employmentType: "Full Time",
        workMode: "Hybrid",
        salaryMin: 250000,
        salaryMax: 350000,
        postedDate: "Posted 2 days ago",
    },
    {
        id: 2,
        title: "UI/UX Designer",
        company: "Creative Labs",
        location: "Kandy",
        employmentType: "Full Time",
        workMode: "On-site",
        salaryMin: 160000,
        salaryMax: 220000,
        postedDate: "Posted 4 days ago",
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudNova Technologies",
        location: "Remote",
        employmentType: "Contract",
        workMode: "Remote",
        salaryMin: 280000,
        salaryMax: 400000,
        postedDate: "Posted 1 day ago",
    },
    {
        id: 4,
        title: "Business Analyst",
        company: "Apex Consulting",
        location: "Colombo",
        employmentType: "Full Time",
        workMode: "Hybrid",
        salaryMin: 180000,
        salaryMax: 260000,
        postedDate: "Posted 3 days ago",
    },
    {
        id: 5,
        title: "Digital Marketing Executive",
        company: "BrightWave Media",
        location: "Galle",
        employmentType: "Full Time",
        workMode: "On-site",
        salaryMin: 110000,
        salaryMax: 160000,
        postedDate: "Posted 5 days ago",
    },
    {
        id: 6,
        title: "Software Engineering Intern",
        company: "CodeBridge",
        location: "Colombo",
        employmentType: "Internship",
        workMode: "Hybrid",
        salaryMin: 45000,
        salaryMax: 65000,
        postedDate: "Posted today",
    },
];

export default function FeaturedJobs() {
    const navigate = useNavigate();

    function handleViewAllJobs() {
        navigate("/jobs");
    }

    return (
        <section className="featured-jobs">
            <Container>
                <SectionHeader
                    eyebrow="Latest Opportunities"
                    title="Featured Jobs"
                    description="Explore selected career opportunities from trusted employers across Sri Lanka."
                    actions={
                        <Button
                            variant="outline"
                            rightIcon="→"
                            onClick={handleViewAllJobs}
                        >
                            View All Jobs
                        </Button>
                    }
                />

                <div className="featured-jobs__grid">
                    {featuredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                        />
                    ))}
                </div>

                <div className="featured-jobs__mobile-action">
                    <Button
                        variant="outline"
                        rightIcon="→"
                        fullWidth
                        onClick={handleViewAllJobs}
                    >
                        View All Jobs
                    </Button>
                </div>
            </Container>
        </section>
    );
}