import { useEffect, useRef, useState } from "react";

import Container from "../common/Container";
import {
    Briefcase,
    Building2,
    Target,
    Users,
} from "../common/Icons";
import SectionHeader from "../common/SectionHeader";

import "./Statistics.css";

const statistics = [
    {
        id: 1,
        icon: Briefcase,
        value: 15000,
        suffix: "+",
        label: "Jobs Available",
    },
    {
        id: 2,
        icon: Building2,
        value: 850,
        suffix: "+",
        label: "Companies Hiring",
    },
    {
        id: 3,
        icon: Users,
        value: 28000,
        suffix: "+",
        label: "Registered Candidates",
    },
    {
        id: 4,
        icon: Target,
        value: 95,
        suffix: "%",
        label: "Successful Placements",
    },
];

function Counter({ end, suffix, shouldStart }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) {
            return undefined;
        }

        let animationFrameId;
        const duration = 1600;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const nextValue = Math.round(end * easedProgress);

            setCount(nextValue);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [end, shouldStart]);

    return (
        <>
            {new Intl.NumberFormat("en-LK").format(count)}
            {suffix}
        </>
    );
}

export default function Statistics() {
    const sectionRef = useRef(null);
    const [hasEnteredView, setHasEnteredView] = useState(false);

    useEffect(() => {
        const sectionElement = sectionRef.current;

        if (!sectionElement) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasEnteredView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.25,
            }
        );

        observer.observe(sectionElement);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="statistics"
        >
            <Container>
                <SectionHeader
                    eyebrow="ApexHire In Numbers"
                    title="Helping Candidates and Employers Connect"
                    description="Thousands of professionals and leading companies trust ApexHire to discover opportunities and build successful careers."
                    align="center"
                />

                <div className="statistics__grid">
                    {statistics.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.id}
                                className="statistics__card"
                            >
                                <div className="statistics__icon">
                                    <Icon
                                        size={34}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="statistics__value">
                                    <Counter
                                        end={item.value}
                                        suffix={item.suffix}
                                        shouldStart={hasEnteredView}
                                    />
                                </h3>

                                <p className="statistics__label">
                                    {item.label}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}