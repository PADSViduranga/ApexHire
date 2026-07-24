import Container from "../common/Container";
import { Star } from "../common/Icons";
import SectionHeader from "../common/SectionHeader";

import "./Testimonials.css";

const testimonials = [
    {
        id: 1,
        name: "Kasun Perera",
        role: "Software Engineer",
        company: "Virtusa",
        rating: 5,
        initials: "KP",
        comment:
            "ApexHire made my job search incredibly easy. Within two weeks I received multiple interview invitations and accepted a great offer.",
    },
    {
        id: 2,
        name: "Nadeesha Silva",
        role: "HR Manager",
        company: "Dialog Axiata",
        rating: 5,
        initials: "NS",
        comment:
            "Recruiting through ApexHire has been fast and efficient. The platform helped us find qualified candidates with minimal effort.",
    },
    {
        id: 3,
        name: "Tharindu Fernando",
        role: "UI/UX Designer",
        company: "WSO2",
        rating: 5,
        initials: "TF",
        comment:
            "The interface is clean, modern, and simple to use. I could track every application from one place without confusion.",
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials">
            <Container>
                <SectionHeader
                    eyebrow="Success Stories"
                    title="What Our Users Say"
                    description="Thousands of professionals and recruiters trust ApexHire every day."
                    align="center"
                />

                <div className="testimonials__grid">
                    {testimonials.map((item) => (
                        <article
                            key={item.id}
                            className="testimonial-card"
                        >
                            <div className="testimonial-card__stars">
                                {[...Array(item.rating)].map((_, index) => (
                                    <Star
                                        key={index}
                                        size={18}
                                        strokeWidth={2}
                                        fill="currentColor"
                                    />
                                ))}
                            </div>

                            <p className="testimonial-card__comment">
                                "{item.comment}"
                            </p>

                            <div className="testimonial-card__user">
                                <div className="testimonial-card__avatar">
                                    {item.initials}
                                </div>

                                <div>
                                    <h4>{item.name}</h4>

                                    <span>
                                        {item.role} • {item.company}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
}