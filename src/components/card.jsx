
export default function Card({ title, content, image, className = "" }) {
    return (
        <div className={`max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
            {image && (
                <img
                    src={image}
                    alt="Card Cover"
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600">{content}</p>
            </div>
        </div>
    );
}
