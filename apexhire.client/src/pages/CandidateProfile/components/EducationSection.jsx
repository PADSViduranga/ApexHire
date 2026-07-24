import { useState } from "react";
import candidateProfileService from "../../../services/candidateProfileService";
import EducationDialog from "../dialogs/EducationDialog";

export default function EducationSection({
    profile,
    reload
}) {
    const [open, setOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(null);

    async function handleDelete(id) {

        if (!window.confirm("Delete this education record?"))
            return;

        try {

            await candidateProfileService.deleteEducation(id);

            await reload();

        }
        catch (error) {

            console.error(error);

            alert("Unable to delete education.");

        }

    }

    function handleAdd() {
        setSelectedEducation(null);
        setOpen(true);
    }

    function handleEdit(education) {
        setSelectedEducation(education);
        setOpen(true);
    }

    return (
        <>
            <section className="profile-card">

                <div className="card-header">

                    <h2>Education</h2>

                    <button
                        className="primary-btn"
                        onClick={handleAdd}
                    >
                        Add Education
                    </button>

                </div>

                {profile.educations?.length === 0 && (
                    <p>No education records.</p>
                )}

                {profile.educations?.map(education => (

                    <div
                        key={education.id}
                        className="timeline-card"
                    >

                        <h3>{education.institution}</h3>

                        <h4>{education.degree}</h4>

                        <p>{education.fieldOfStudy}</p>

                        <small>

                            {new Date(
                                education.startDate
                            ).getFullYear()}

                            {" - "}

                            {education.endDate
                                ? new Date(
                                    education.endDate
                                ).getFullYear()
                                : "Present"}

                        </small>

                        <p>{education.description}</p>

                        <div className="timeline-actions">

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    handleEdit(education)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger-btn"
                                onClick={() =>
                                    handleDelete(
                                        education.id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </section>

            <EducationDialog
                open={open}
                education={selectedEducation}
                reload={reload}
                onClose={() => setOpen(false)}
            />
        </>
    );
}