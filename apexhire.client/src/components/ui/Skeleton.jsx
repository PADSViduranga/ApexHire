import "./Skeleton.css";

export default function Skeleton({
    variant = "text",
    width,
    height,
    className = "",
}) {
    const style = {
        width,
        height,
    };

    if (variant === "job") {
        return (
            <div className={`skeleton-job ${className}`}>
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-company" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />

                <div className="skeleton-tags">
                    <div className="skeleton skeleton-tag" />
                    <div className="skeleton skeleton-tag" />
                    <div className="skeleton skeleton-tag" />
                </div>

                <div className="skeleton skeleton-button" />
            </div>
        );
    }

    if (variant === "avatar") {
        return (
            <div
                className={`skeleton skeleton-avatar ${className}`}
                style={style}
            />
        );
    }

    return (
        <div
            className={`skeleton ${className}`}
            style={style}
        />
    );
}