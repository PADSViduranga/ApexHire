import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./index.css";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/typography.css";
import "./styles/utilities.css";
import "./styles/animations.css";

AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    offset: 80,
});

const rootElement =
    document.getElementById("root");

if (!rootElement) {
    throw new Error(
        'Root element with id "root" was not found.'
    );
}

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);