import { useEffect, useState } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <a href="/" className="brand">
                ApexHire
            </a>

            <div className="nav-links">
                <a href="/" className="active">Home</a>
                <a href="/jobs">Jobs</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/admin">Admin</a>
                <a href="/about">About</a>
            </div>

            <div className="nav-account">
                <span>Welcome, Alex</span>
                <div className="nav-avatar">A</div>
            </div>
        </nav>
    );
}