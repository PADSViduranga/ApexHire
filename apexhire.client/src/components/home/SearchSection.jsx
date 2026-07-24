import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";

import "./SearchSection.css";

export default function SearchSection() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        title: "",
        location: "",
        employmentType: "",
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const query = new URLSearchParams();

        if (filters.title.trim()) {
            query.set("title", filters.title.trim());
        }

        if (filters.location.trim()) {
            query.set("location", filters.location.trim());
        }

        if (filters.employmentType) {
            query.set("employmentType", filters.employmentType);
        }

        const queryString = query.toString();

        navigate(queryString ? `/jobs?${queryString}` : "/jobs");
    }

    return (
        <section className="search-section">
            <Container>
                <div className="search-card">
                    <div className="search-header">
                        <h2>Search Your Next Opportunity</h2>

                        <p>
                            Discover thousands of jobs from trusted employers
                            across Sri Lanka.
                        </p>
                    </div>

                    <form
                        className="search-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="search-field">
                            <label htmlFor="title">
                                Job Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Software Engineer"
                                value={filters.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="search-field">
                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Colombo"
                                value={filters.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="search-field">
                            <label htmlFor="employmentType">
                                Employment Type
                            </label>

                            <select
                                id="employmentType"
                                name="employmentType"
                                value={filters.employmentType}
                                onChange={handleChange}
                            >
                                <option value="">
                                    All Types
                                </option>

                                <option value="FullTime">
                                    Full Time
                                </option>

                                <option value="PartTime">
                                    Part Time
                                </option>

                                <option value="Contract">
                                    Contract
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>

                                <option value="Remote">
                                    Remote
                                </option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="search-button"
                        >
                            Search Jobs
                        </Button>
                    </form>
                </div>
            </Container>
        </section>
    );
}