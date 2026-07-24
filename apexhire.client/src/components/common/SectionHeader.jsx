import "./SectionHeader.css";

export default function SectionHeader({
    eyebrow,
    title,
    description,
    align = "left",
    actions = null,
}) {
    return (
        <div className={`section-header section-header--${align}`}>
            <div className="section-header__content">
                {eyebrow && (
                    <span className="section-header__eyebrow">
                        {eyebrow}
                    </span>
                )}

                <h2 className="section-header__title">
                    {title}
                </h2>

                {description && (
                    <p className="section-header__description">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="section-header__actions">
                    {actions}
                </div>
            )}
        </div>
    );
}