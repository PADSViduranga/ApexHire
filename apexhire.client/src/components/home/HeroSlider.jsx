import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hero1 from "../../assets/images/hero/hero-1.jpg";
import hero2 from "../../assets/images/hero/hero-2.jpg";
import hero3 from "../../assets/images/hero/hero-3.jpg";

import "./HeroSlider.css";

const slides = [
    {
        id: 1,
        image: hero1,
        eyebrow: "Build Your Future",
        title: "Find Your Dream Career",
        description:
            "Explore opportunities with trusted companies and take the next step in your professional journey.",
        primaryLabel: "Browse Jobs",
        primaryLink: "/jobs",
        secondaryLabel: "Create Account",
        secondaryLink: "/register",
    },
    {
        id: 2,
        image: hero2,
        eyebrow: "For Employers",
        title: "Hire Exceptional Talent",
        description:
            "Post vacancies, connect with qualified professionals, and build stronger teams with ApexHire.",
        primaryLabel: "Post a Job",
        primaryLink: "/register",
        secondaryLabel: "Browse Jobs",
        secondaryLink: "/jobs",
    },
    {
        id: 3,
        image: hero3,
        eyebrow: "Grow With Confidence",
        title: "Your Future Starts Here",
        description:
            "Join professionals and employers building better careers and stronger organizations every day.",
        primaryLabel: "Get Started",
        primaryLink: "/register",
        secondaryLabel: "Explore Opportunities",
        secondaryLink: "/jobs",
    },
];

const AUTOPLAY_DELAY = 5000;

export default function HeroSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    function showPreviousSlide() {
        setActiveIndex((currentIndex) =>
            currentIndex === 0 ? slides.length - 1 : currentIndex - 1
        );
    }

    function showNextSlide() {
        setActiveIndex((currentIndex) =>
            currentIndex === slides.length - 1 ? 0 : currentIndex + 1
        );
    }

    function showSlide(index) {
        setActiveIndex(index);
    }

    function handleKeyDown(event) {
        if (event.key === "ArrowLeft") {
            showPreviousSlide();
        }

        if (event.key === "ArrowRight") {
            showNextSlide();
        }
    }

    useEffect(() => {
        if (isPaused) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((currentIndex) =>
                currentIndex === slides.length - 1 ? 0 : currentIndex + 1
            );
        }, AUTOPLAY_DELAY);

        return () => {
            window.clearInterval(timer);
        };
    }, [isPaused]);

    return (
        <section
            className="hero-slider"
            aria-roledescription="carousel"
            aria-label="ApexHire career highlights"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
        >
            <div className="hero-slider__slides">
                {slides.map((slide, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <article
                            key={slide.id}
                            className={`hero-slide ${isActive ? "hero-slide--active" : ""
                                }`}
                            aria-hidden={!isActive}
                        >
                            <img
                                className="hero-slide__image"
                                src={slide.image}
                                alt=""
                            />

                            <div className="hero-slide__overlay" />

                            <div className="hero-slide__content-wrapper">
                                <div className="hero-slide__content">
                                    <span className="hero-slide__eyebrow">
                                        {slide.eyebrow}
                                    </span>

                                    <h1 className="hero-slide__title">
                                        {slide.title}
                                    </h1>

                                    <p className="hero-slide__description">
                                        {slide.description}
                                    </p>

                                    <div className="hero-slide__actions">
                                        <Link
                                            className="hero-button hero-button--primary"
                                            to={slide.primaryLink}
                                            tabIndex={isActive ? 0 : -1}
                                        >
                                            {slide.primaryLabel}
                                            <span aria-hidden="true">→</span>
                                        </Link>

                                        <Link
                                            className="hero-button hero-button--secondary"
                                            to={slide.secondaryLink}
                                            tabIndex={isActive ? 0 : -1}
                                        >
                                            {slide.secondaryLabel}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <button
                className="hero-slider__arrow hero-slider__arrow--previous"
                type="button"
                onClick={showPreviousSlide}
                aria-label="Show previous slide"
            >
                <span aria-hidden="true">‹</span>
            </button>

            <button
                className="hero-slider__arrow hero-slider__arrow--next"
                type="button"
                onClick={showNextSlide}
                aria-label="Show next slide"
            >
                <span aria-hidden="true">›</span>
            </button>

            <div
                className="hero-slider__indicators"
                aria-label="Choose a slide"
            >
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        className={`hero-slider__indicator ${index === activeIndex
                                ? "hero-slider__indicator--active"
                                : ""
                            }`}
                        type="button"
                        onClick={() => showSlide(index)}
                        aria-label={`Show slide ${index + 1}`}
                        aria-current={
                            index === activeIndex ? "true" : undefined
                        }
                    />
                ))}
            </div>

            <div
                className="hero-slider__progress"
                aria-hidden="true"
            >
                <span
                    key={activeIndex}
                    className={`hero-slider__progress-bar ${isPaused ? "hero-slider__progress-bar--paused" : ""
                        }`}
                />
            </div>
        </section>
    );
}