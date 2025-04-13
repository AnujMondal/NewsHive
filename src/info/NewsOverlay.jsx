const NewsOverlay = ({ news, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(44, 36, 36, 0.3)" }}
    >
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl relative shadow-lg">
        {/* Cross Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-4xl font-bold transition-transform transform hover:scale-110 cursor-pointer"
        >
          &times;
        </button>

        {/* Header (Title) */}
        <h2 className="text-2xl font-bold mb-4">{news.title}</h2>

        {/* Image */}
        {news.media && news.media.path && (
          <img
            src={"https://newshive-express-1.onrender.com/images/" + news.media.path}
            alt={news.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-96 mb-4"> {/* Added scroll */}
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: news.content }}
          ></p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Reporter:</strong> {news.reporter || "N/A"}
          </div>
          <div>
            <strong>Category:</strong> {news.category || "N/A"}
          </div>
          <div>
            <strong>Date:</strong> {new Date(news.publishedAt).toLocaleDateString()}
          </div>
          <div>
            <strong>Editor:</strong> {news.editor || "N/A"}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  news.status === "active"
                    ? "#10B981" // Green for active
                    : news.status === "pending"
                    ? "#FBBF24" // Yellow for pending
                    : "#EF4444", // Red for inactive
              }}
            ></span>{" "}
            {news.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsOverlay;
