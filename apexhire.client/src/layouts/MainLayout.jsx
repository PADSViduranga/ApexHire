import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "./MainLayout.css";

export default function MainLayout() {
    return (
        <div className="app-shell">
            {/* Global Navigation */}
            <Navbar />

            {/* Page Content */}
            <main className="page-container">
                <Outlet />
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}