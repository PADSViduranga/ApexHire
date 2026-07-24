import Button from "../../../components/common/Button";

import "./JobFilters.css";

const employmentTypes = [
    {
        value: "FullTime",
        label: "Full Time",
    },
    {
        value: "PartTime",
        label: "Part Time",
    },
    {
        value: "Contract",
        label: "Contract",
    },
    {
        value: "Internship",
        label: "Internship",
    },
    {
        value: "Remote",
        label: "Remote",
    },
];

export default function JobFilters({
    filters,
    onChange,
    onReset,
}) {
    return (
        <div className="job-filters">
            <h3 className="job-filters__title">
                Filters
            </h3>

            <div className="job-filters__group">
                <label htmlFor="job-location">
                    Location
                </label>

                <input
                    id="job-location"
                    type="text"
                    value={
                        filters.location
                    }
                    placeholder="e.g. Colombo"
                    onChange={(event) =>
                        onChange(
                            "location",
                            event.target.value
                        )
                    }
                />
            </div>

            <div className="job-filters__group">
                <label htmlFor="employment-type">
                    Employment Type
                </label>

                <select
                    id="employment-type"
                    value={
                        filters.employmentType
                    }
                    onChange={(event) =>
                        onChange(
                            "employmentType",
                            event.target.value
                        )
                    }
                >
                    <option value="">
                        All Types
                    </option>

                    {employmentTypes.map(
                        (type) => (
                            <option
                                key={
                                    type.value
                                }
                                value={
                                    type.value
                                }
                            >
                                {
                                    type.label
                                }
                            </option>
                        )
                    )}
                </select>
            </div>

            <div className="job-filters__group">
                <label htmlFor="minimum-salary">
                    Minimum Salary
                </label>

                <input
                    id="minimum-salary"
                    type="number"
                    min="0"
                    step="1000"
                    value={
                        filters.minimumSalary
                    }
                    placeholder="0"
                    onChange={(event) =>
                        onChange(
                            "minimumSalary",
                            event.target.value
                        )
                    }
                />
            </div>

            <div className="job-filters__group">
                <label htmlFor="maximum-salary">
                    Maximum Salary
                </label>

                <input
                    id="maximum-salary"
                    type="number"
                    min="0"
                    step="1000"
                    value={
                        filters.maximumSalary
                    }
                    placeholder="500000"
                    onChange={(event) =>
                        onChange(
                            "maximumSalary",
                            event.target.value
                        )
                    }
                />
            </div>

            <Button
                type="button"
                fullWidth
                variant="outline"
                onClick={onReset}
            >
                Reset Filters
            </Button>
        </div>
    );
}