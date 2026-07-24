import { useEffect, useState } from "react";
import candidateProfileService from "../../../services/candidateProfileService";

const initialForm = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: ""
};

export default function EducationDialog({
    open,
    education,
    onClose,
    reload
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (!education) {
            setForm(initialForm);
            return;
        }

        setForm({
            institution: education.institution ?? "",
            degree: education.degree ?? "",
            fieldOfStudy: education.fieldOfStudy ?? "",
            startDate: education.startDate?.substring(0, 10) ?? "",
            endDate: education.endDate?.substring(0, 10) ?? "",
            description: education.description ?? ""
        });

    }, [education]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {

            if (education) {

                await candidateProfileService.updateEducation(
                    education.id,
                    form
                );

            } else {

                await candidateProfileService.createEducation(
                    form
                );

            }

            await reload();

            onClose();

        }
        catch (error) {
            console.error(error);
            alert("Unable to save education.");
        }
    }

    if (!open)
        return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>
                    {education ? "Edit Education" : "Add Education"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="institution"
                        placeholder="Institution"
                        value={form.institution}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="degree"
                        placeholder="Degree"
                        value={form.degree}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="fieldOfStudy"
                        placeholder="Field of Study"
                        value={form.fieldOfStudy}
                        onChange={handleChange}
                    />

                    <label>Start Date</label>

                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />

                    <label>End Date</label>

                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                    />

                    <textarea
                        rows={4}
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <div className="modal-buttons">

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="primary-btn"
                            type="submit"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}