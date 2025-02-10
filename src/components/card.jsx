
// eslint-disable-next-line react/prop-types
export  default  function Card({ children, className = "" }) {
    return (
        <div className={`max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
            {children}
        </div>
    );
}