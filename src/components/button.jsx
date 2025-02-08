
export default function Button({ label, onClick, type = "button", className = "" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        >
            {label}
        </button>
    );
}
