export default function SkillsSection({
    profile
}) {
    const skills =
        profile.skills
            ?.split(",")
            .map(skill => skill.trim())
            .filter(Boolean) || [];

    return (
        <section className="profile-card">

            <div className="card-header">

                <h2>Skills</h2>

            </div>

            <div className="skills-list">

                {skills.length === 0 && (
                    <p>No skills added.</p>
                )}

                {skills.map(skill => (

                    <span
                        key={skill}
                        className="skill-chip"
                    >
                        {skill}
                    </span>

                ))}

            </div>

        </section>
    );
}