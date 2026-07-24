import "./AboutSection.css";

export default function AboutSection({
    profile = {},
}) {
    const professionalSummary =
        profile.professionalSummary?.trim();

    return (
        <section
            className="profile-card about-card"
            aria-labelledby="about-section-title"
        >
            <div className="about-card__header">
                <div
                    className="about-card__icon"
                    aria-hidden="true"
                >
                    AB
                </div>

                <div className="about-card__header-content">
                    <h2 id="about-section-title">
                        About
                    </h2>

                    <span>
                        Professional overview
                    </span>
                </div>
            </div>

            <p
                className={
                    professionalSummary
                        ? "about-text"
                        : "about-text about-text--empty"
                }
            >
                {professionalSummary ||
                    "No professional summary added yet."}
            </p>
        </section>
    );
}
