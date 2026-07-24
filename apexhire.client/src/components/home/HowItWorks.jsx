import Container from "../common/Container";
import {
    ArrowRight,
    Briefcase,
    Search,
    UserCheck,
} from "../common/Icons";
import SectionHeader from "../common/SectionHeader";

import "./HowItWorks.css";

const steps = [
    {
        id: 1,
        number: "01",
        icon: Search,
        title: "Search Jobs",
        description:
            "Browse thousands of opportunities using filters like location, salary, and employment type.",
    },
    {
        id: 2,
        number: "02",
        icon: Briefcase,
        title: "Apply Online",
        description:
            "Submit your application quickly using your ApexHire profile and uploaded resume.",
    },
    {
        id: 3,
        number: "03",
        icon: UserCheck,
        title: "Interview",
        description:
            "Recruiters review your application and invite shortlisted candidates for interviews.",
    },
    {
        id: 4,
        number: "04",
        icon: ArrowRight,
        title: "Get Hired",
        description:
            "Receive your offer, accept it, and begin the next exciting step in your career.",
    },
];

export default function HowItWorks() {
    return (
        <section className="how-it-works">
            <Container>
                <SectionHeader
                    eyebrow="Simple Process"
                    title="How ApexHire Works"
                    description="Finding your dream job has never been easier. Follow these four simple steps to begin your career journey."
                    align="center"
                />

                <div className="how-it-works__timeline">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <article
                                key={step.id}
                                className="step-card"
                            >
                                <span className="step-card__number">
                                    {step.number}
                                </span>

                                <div className="step-card__icon">
                                    <Icon
                                        size={36}
                                        strokeWidth={2}
                                    />
                                </div>

                                <h3>{step.title}</h3>

                                <p>{step.description}</p>

                                {index !== steps.length - 1 && (
                                    <div className="step-card__line" />
                                )}
                            </article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}