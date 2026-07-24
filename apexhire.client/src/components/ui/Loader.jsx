import "./Loader.css";

export default function Loader({
    message = "Loading...",
    fullScreen = false,
}) {
    return (
        <div
            className={`loader ${fullScreen ? "loader--fullscreen" : ""
                }`}
            role="status"
            aria-live="polite"
        >
            <div className="loader__spinner" />

            <p className="loader__text">
                {message}
            </p>
        </div>
    );
}