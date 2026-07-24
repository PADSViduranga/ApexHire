import "./Container.css";

export default function Container({
    children,
    size = "default",
    className = "",
}) {
    return (
        <div
            className={`container container--${size} ${className}`.trim()}
        >
            {children}
        </div>
    );
}