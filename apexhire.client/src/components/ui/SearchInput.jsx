import { Search, X } from "../common/Icons";

import "./SearchInput.css";

export default function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    onClear,
    className = "",
}) {
    return (
        <div className={`search-input ${className}`}>
            <Search
                className="search-input__icon"
                size={18}
            />

            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className="search-input__field"
            />

            {value && (
                <button
                    type="button"
                    className="search-input__clear"
                    onClick={onClear}
                    aria-label="Clear search"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}