import { Outlet } from "react-router-dom";

import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";
import Footer from "../components/layout/Footer";

import "../pages/Recruiter/RecruiterDashboard.css";

export default function RecruiterLayout() {
    return (
        <div className="app-shell">

            <div className="recruiter-layout">

                <RecruiterSidebar />

                <main className="recruiter-content">
                    <Outlet />
                </main>

            </div>

            <Footer />

        </div>
    );
}
