import {
    Link,
    NavLink,
    useNavigate
} from 'react-router-dom';

import { useState } from 'react';

import { useAuth } from '../../context/AuthContext';

import './Navbar.css';

export default function Navbar() {
    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    function getNavLinkClass({ isActive }) {
        return isActive
            ? 'navbar-link navbar-link-active'
            : 'navbar-link';
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function handleLogout() {
        logout();
        closeMenu();
        navigate('/login');
    }

    const isAdministrator =
        user?.role === 'Admin' ||
        user?.role === 'Administrator';

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link
                    className="navbar-brand"
                    to="/"
                    onClick={closeMenu}
                    aria-label="ApexHire home"
                >
                    <span className="navbar-brand-mark">
                        A
                    </span>

                    <span className="navbar-brand-content">
                        <span className="navbar-brand-name">
                            ApexHire
                        </span>

                        <span className="navbar-brand-tagline">
                            Talent meets opportunity
                        </span>
                    </span>
                </Link>

                <button
                    type="button"
                    className={`navbar-toggle ${isMenuOpen
                            ? 'navbar-toggle-open'
                            : ''
                        }`}
                    onClick={() => {
                        setIsMenuOpen((currentValue) => {
                            return !currentValue;
                        });
                    }}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    className={`navbar-content ${isMenuOpen
                            ? 'navbar-content-open'
                            : ''
                        }`}
                >
                    <nav
                        className="navbar-links"
                        aria-label="Main navigation"
                    >
                        <NavLink
                            className={getNavLinkClass}
                            to="/jobs"
                            onClick={closeMenu}
                        >
                            Jobs
                        </NavLink>

                        {user?.role === 'Candidate' && (
                            <>
                                <NavLink
                                    className={getNavLinkClass}
                                    to="/profile"
                                    onClick={closeMenu}
                                >
                                    My Profile
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/applications"
                                    onClick={closeMenu}
                                >
                                    My Applications
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/interviews"
                                    onClick={closeMenu}
                                >
                                    My Interviews
                                </NavLink>
                            </>
                        )}

                        {user?.role === 'Recruiter' && (
                            <>
                                <NavLink
                                    className={getNavLinkClass}
                                    to="/jobs/create"
                                    onClick={closeMenu}
                                >
                                    Create Job
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/recruiter/jobs"
                                    onClick={closeMenu}
                                >
                                    Manage Jobs
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/staff/applications"
                                    onClick={closeMenu}
                                >
                                    Applications
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/staff/candidate-feedback"
                                    onClick={closeMenu}
                                >
                                    Feedback
                                </NavLink>
                            </>
                        )}

                        {user?.role === 'HiringManager' && (
                            <>
                                <NavLink
                                    className={getNavLinkClass}
                                    to="/staff/applications"
                                    onClick={closeMenu}
                                >
                                    Applications
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/manager/interviews"
                                    onClick={closeMenu}
                                >
                                    Interviews
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/staff/candidate-feedback"
                                    onClick={closeMenu}
                                >
                                    Feedback
                                </NavLink>
                            </>
                        )}

                        {isAdministrator && (
                            <>
                                <NavLink
                                    className={getNavLinkClass}
                                    to="/admin"
                                    onClick={closeMenu}
                                >
                                    Administration
                                </NavLink>

                                <NavLink
                                    className={getNavLinkClass}
                                    to="/staff/candidate-feedback"
                                    onClick={closeMenu}
                                >
                                    Feedback
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <div className="navbar-account">
                        {isAuthenticated ? (
                            <>
                                <div className="navbar-user">
                                    <div className="navbar-user-avatar">
                                        {user?.fullName
                                            ?.charAt(0)
                                            ?.toUpperCase() || 'U'}
                                    </div>

                                    <div className="navbar-user-details">
                                        <span className="navbar-user-name">
                                            {user?.fullName ||
                                                user?.name ||
                                                'ApexHire User'}
                                        </span>

                                        <span className="navbar-user-role">
                                            {user?.role || 'User'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="navbar-logout-button"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <div className="navbar-auth-actions">
                                <NavLink
                                    className="navbar-login-link"
                                    to="/login"
                                    onClick={closeMenu}
                                >
                                    Log in
                                </NavLink>

                                <NavLink
                                    className="navbar-register-link"
                                    to="/register"
                                    onClick={closeMenu}
                                >
                                    Create account
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}