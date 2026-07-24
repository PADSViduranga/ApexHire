import { useState } from "react";
import candidateProfileService from "../../../services/candidateProfileService";
import ExperienceDialog from "../dialogs/ExperienceDialog";

export default function ExperienceSection({
    profile,
    reload
}) {
    const [open, setOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);

    async function handleDelete(id) {

        if (!window.confirm("Delete this experience?"))
            return;

        try {

            await candidateProfileService.deleteExperience(id);

            await reload();

        }
        catch (error) {

            console.error(error);

            alert("Unable to delete experience.");

        }

    }

    function handleAdd() {
        setSelectedExperience(null);
        setOpen(true);
    }

    function handleEdit(experience) {
        setSelectedExperience(experience);
        setOpen(true);
    }

    return (
        <>
            <section className="profile-card">

                <div className="card-header">

                    <h2>Experience</h2>

                    <button
                        className="primary-btn"
                        onClick={handleAdd}
                    >
                        Add Experience
                    </button>

                </div>

                {profile.experiences?.length === 0 && (
                    <p>No experience records.</p>
                )}

                {profile.experiences?.map(experience => (

                    <div
                        key={experience.id}
                        className="timeline-card"
                    >

                        <h3>{experience.company}</h3>

                        <h4>{experience.position}</h4>

                        <p>{experience.employmentType}</p>

                        <small>

                            {new Date(
                                experience.startDate
                            ).getFullYear()}

                            {" - "}

                            {experience.currentJob
                                ? "Present"
                                : experience.endDate
                                    ? new Date(
                                        experience.endDate
                                    ).getFullYear()
                                    : ""}

                        </small>

                        <p>{experience.description}</p>

                        <div className="timeline-actions">

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    handleEdit(experience)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger-btn"
                                onClick={() =>
                                    handleDelete(
                                        experience.id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </section>

            <ExperienceDialog
                open={open}
                experience={selectedExperience}
                reload={reload}
                onClose={() => setOpen(false)}
            />
        </>
    );
}