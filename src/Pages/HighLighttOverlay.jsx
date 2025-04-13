import { useState } from "react";
import axios from "axios";
import ToastNotification from "../context/ToastNotification";
const HighLighttOverlay = ({ news, onClose }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const handleSubmit = async () => {
    try {
      const editor = localStorage.getItem("user");
      const res = await axios.post("https://newshive-express-1.onrender.com/highlight", {
        newsId: news._id,
        startTime,
        endTime,
        editor,
      });

      if (res.status === 200 && res.data == "Successfully booked") {
        setError("");
        setToast({"message":"Booked Successfully!", "type":"success"});
        await sleep(3000); 
        onClose();
      setToast(null);
      } else {
        setToast({"message":error, "type":"error"});
      }
    } catch (err) {
      
    }
  };

  return (
    <>
          {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(44, 36, 36, 0.3)" }}
    >
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl relative shadow-lg max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-4xl font-bold transition-transform transform hover:scale-110 cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">{news.title}</h2>

        {news.media?.path && (
          <img
            src={`https://newshive-express-1.onrender.com/images/${news.media.path}`}
            alt={news.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-gray-700 mb-4">{news.content}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full mb-6"
        >
          Submit
        </button>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 pb-4">
          <div><strong>Reporter:</strong> {news.reporter || "N/A"}</div>
          <div><strong>Category:</strong> {news.category || "N/A"}</div>
          <div><strong>Date:</strong> {new Date(news.publishedAt).toLocaleDateString()}</div>
          <div><strong>Editor:</strong> {news.editor || "N/A"}</div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  news.status === "active"
                    ? "#10B981"
                    : news.status === "pending"
                    ? "#FBBF24"
                    : "#EF4444",
              }}
            ></span>{" "}
            {news.status}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HighLighttOverlay;
