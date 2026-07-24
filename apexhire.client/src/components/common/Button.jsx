import "./Button.css";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    type = "button",
    onClick,
    className = "",
    ...props
}) {
    const classes = [
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && "btn--full",
        loading && "btn--loading",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <>
                    <span
                        className="btn__spinner"
                        aria-hidden="true"
                    />

                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && (
                        <span
                            className="btn__icon"
                            aria-hidden="true"
                        >
                            {leftIcon}
                        </span>
                    )}

                    <span>{children}</span>

                    {rightIcon && (
                        <span
                            className="btn__icon"
                            aria-hidden="true"
                        >
                            {rightIcon}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}