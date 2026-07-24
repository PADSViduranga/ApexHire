import "./ProfileCompletion.css";

function hasValue(value) {
    if (typeof value === "number") {
        return value > 0;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return Boolean(
        value?.toString().trim()
    );
}

export default function ProfileCompletion({
    profile = {},
}) {
    const completionItems = [
        {
            label: "Profile photo",
            completed: hasValue(
                profile.profileImageUrl
            ),
        },
        {
            label: "Professional headline",
            completed: hasValue(
                profile.headline
            ),
        },
        {
            label: "Location",
            completed: hasValue(
                profile.location
            ),
        },
        {
            label: "Professional summary",
            completed: hasValue(
                profile.professionalSummary
            ),
        },
        {
            label: "Skills",
            completed: hasValue(
                profile.skills
            ),
        },
        {
            label: "Work experience",
            completed: hasValue(
                profile.experiences
            ),
        },
        {
            label: "Education",
            completed: hasValue(
                profile.educations
            ),
        },
        {
            label: "Resume",
            completed: hasValue(
                profile.resumeFileName
            ),
        },
        {
            label: "Professional link",
            completed:
                hasValue(
                    profile.linkedInUrl
                ) ||
                hasValue(
                    profile.gitHubUrl
                ) ||
                hasValue(
                    profile.portfolioUrl
                ),
        },
    ];

    const completedCount =
        completionItems.filter(
            (item) => item.completed
        ).length;

    const percentage = Math.round(
        (
            completedCount /
            completionItems.length
        ) * 100
    );

    const missingItems =
        completionItems.filter(
            (item) => !item.completed
        );

    return (
        <section
            className="
                profile-card
                profile-completion-card
            "
            aria-labelledby="profile-completion-title"
        >
            <div className="completion-header">
                <div>
                    <h2 id="profile-completion-title">
                        Profile Completion
                    </h2>

                    <p>
                        Complete your profile to
                        improve your chances of being
                        noticed by recruiters.
                    </p>
                </div>

                <div
                    className="completion-percentage"
                    aria-label={`${percentage}% complete`}
                >
                    {percentage}%
                </div>
            </div>

            <div
                className="completion-progress"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={percentage}
                aria-label="Profile completion"
            >
                <div
                    className="
                        completion-progress-bar
                    "
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <div className="completion-summary">
                <span>
                    {completedCount} of{" "}
                    {completionItems.length} completed
                </span>

                {percentage === 100 && (
                    <strong>
                        Your profile is complete!
                    </strong>
                )}
            </div>

            {missingItems.length > 0 && (
                <div className="completion-missing">
                    <h3>
                        Complete these next
                    </h3>

                    <div className="completion-items">
                        {missingItems.map(
                            (item) => (
                                <span
                                    key={item.label}
                                    className="
                                        completion-item
                                    "
                                >
                                    + {item.label}
                                </span>
                            )
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
