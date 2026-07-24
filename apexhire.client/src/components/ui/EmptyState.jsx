import Button from "../common/Button";
import { Search } from "../common/Icons";

import "./EmptyState.css";

export default function EmptyState({
    icon: Icon = Search,
    title = "No results found",
    description = "We could not find any items matching your request.",
    actionLabel,
    onAction,
}) {
    return (
        <div
            className="empty-state"
            role="status"
            aria-live="polite"
        >
            <div className="empty-state__icon">
                <Icon
                    size={42}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h2 className="empty-state__title">
                {title}
            </h2>

            <p className="empty-state__description">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}