
// eslint-disable-next-line react/prop-types
export default function Button({ onClick, children, className = "", disabled = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg text-white font-medium focus:outline-none disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}