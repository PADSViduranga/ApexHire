import { Link } from "react-router-dom";

import Container from "../common/Container";
import {
    Briefcase,
    Building2,
    MapPin,
    Users,
} from "../common/Icons";

import "./Footer.css";

const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Jobs", to: "/jobs" },
    { label: "Companies", to: "/companies" },
    { label: "About", to: "/about" },
];

const candidateLinks = [
    { label: "Browse Jobs", to: "/jobs" },
    { label: "Create Profile", to: "/register" },
    { label: "Applications", to: "/applications" },
    { label: "Saved Jobs", to: "/saved-jobs" },
];

const recruiterLinks = [
    { label: "Post a Job", to: "/recruiter/jobs/create" },
    { label: "Manage Jobs", to: "/recruiter/jobs" },
    { label: "Find Candidates", to: "/candidates" },
    { label: "Recruiter Dashboard", to: "/dashboard" },
];

export default function Footer() {
    return (
        <footer className="footer">
            <Container>
                <div className="footer__grid">
                    <div className="footer__brand">
                        <Link
                            className="footer__logo"
                            to="/"
                        >
                            <Briefcase
                                size={24}
                                strokeWidth={2}
                            />

                            <span>ApexHire</span>
                        </Link>

                        <p>
                            Connecting talented professionals with
                            trusted employers through a modern
                            recruitment platform.
                        </p>

                        <div className="footer__contact">
                            <span>
                                <MapPin size={16} />
                                Colombo, Sri Lanka
                            </span>

                            <span>
                                <Users size={16} />
                                Trusted by thousands
                            </span>

                            <span>
                                <Building2 size={16} />
                                800+ Companies
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4>Quick Links</h4>

                        <ul>
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4>Job Seekers</h4>

                        <ul>
                            {candidateLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4>Recruiters</h4>

                        <ul>
                            {recruiterLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>
                        © {new Date().getFullYear()} ApexHire. All
                        rights reserved.
                    </p>

                    <p>
                        Designed & Developed with ❤️ using React &
                        ASP.NET Core
                    </p>
                </div>
            </Container>
        </footer>
    );
}