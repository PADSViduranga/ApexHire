import Container from "../common/Container";
import {
    Clock3,
    Search,
    ShieldCheck,
} from "../common/Icons";
import SectionHeader from "../common/SectionHeader";

import "./WhyChooseUs.css";

const features = [
    {
        id: 1,
        icon: Search,
        title: "Smart Job Matching",
        description:
            "Find opportunities that match your skills, experience, and career goals with intelligent search and filtering.",
    },
    {
        id: 2,
        icon: ShieldCheck,
        title: "Trusted Employers",
        description:
            "Connect with verified companies, from growing startups to leading enterprises across Sri Lanka.",
    },
    {
        id: 3,
        icon: Clock3,
        title: "Fast & Simple Applications",
        description:
            "Apply for jobs in just a few clicks and easily track every application from one dashboard.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="why-choose-us">
            <Container>
                <SectionHeader
                    eyebrow="Why ApexHire"
                    title="Everything You Need to Build Your Career"
                    description="ApexHire provides modern tools for both job seekers and recruiters, making the hiring process faster, easier, and more transparent."
                    align="center"
                />

                <div className="why-choose-us__grid">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <article
                                key={feature.id}
                                className="why-card"
                            >
                                <div className="why-card__icon">
                                    <Icon
                                        size={38}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3>{feature.title}</h3>

                                <p>{feature.description}</p>
                            </article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}