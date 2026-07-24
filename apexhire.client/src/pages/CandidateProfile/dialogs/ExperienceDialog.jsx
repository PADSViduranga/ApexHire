import { useEffect, useState } from "react";
import candidateProfileService from "../../../services/candidateProfileService";

const initialForm = {
    company: "",
    position: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    currentJob: false,
    description: ""
};

export default function ExperienceDialog({
    open,
    experience,
    onClose,
    reload
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {

        if (!experience) {
            setForm(initialForm);
            return;
        }

        setForm({
            company: experience.company ?? "",
            position: experience.position ?? "",
            employmentType: experience.employmentType ?? "",
            startDate: experience.startDate?.substring(0, 10) ?? "",
            endDate: experience.endDate?.substring(0, 10) ?? "",
            currentJob: experience.currentJob ?? false,
            description: experience.description ?? ""
        });

    }, [experience]);

    function handleChange(event) {

        const { name, value, type, checked } = event.target;

        setForm(previous => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    }

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            if (experience) {

                await candidateProfileService.updateExperience(
                    experience.id,
                    form
                );

            } else {

                await candidateProfileService.createExperience(
                    form
                );

            }

            await reload();

            onClose();

        }
        catch (error) {

            console.error(error);

            alert("Unable to save experience.");

        }

    }

    if (!open)
        return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {experience
                        ? "Edit Experience"
                        : "Add Experience"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="company"
                        placeholder="Company"
                        value={form.company}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="position"
                        placeholder="Position"
                        value={form.position}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="employmentType"
                        placeholder="Employment Type"
                        value={form.employmentType}
                        onChange={handleChange}
                    />

                    <label>
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />

                    <label>
                        End Date
                    </label>

                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        disabled={form.currentJob}
                    />

                    <label className="checkbox-row">

                        <input
                            type="checkbox"
                            name="currentJob"
                            checked={form.currentJob}
                            onChange={handleChange}
                        />

                        I currently work here

                    </label>

                    <textarea
                        rows={5}
                        name="description"
                        placeholder="Job Description"
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
                            type="submit"
                            className="primary-btn"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}