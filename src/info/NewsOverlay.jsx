import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useState,useEffect } from "react";
const NewsOverlay = ({ news, onClose ,onUpdate}) => {
  const [isEditor,setIsEdtior] = useState(false);
  const [approved, setApproved] = useState("");
  useEffect(()=>{
    if(localStorage.getItem("role") == "editor")
    {
        setIsEdtior(true);
        setApproved(news.status);
    }
},[news]);
  const config = {
    "pending": {
      text: "PENDING",
      icon: null,
      bg: "bg-gray-300",
      textColor: "text-gray-700",
    },
    "active": {
      text: "APPROVED",
      icon: <CheckCircle className="w-5 h-5" />,
      bg: "bg-green-500",
      textColor: "text-white",
    },
    "inactive": {
      text: "NOT APPROVED",
      icon: <XCircle className="w-5 h-5" />,
      bg: "bg-red-500",
      textColor: "text-white",
    },
  };
  const { text, icon, bg, textColor } = config[approved] || config["pending"];
  const toggle = async() => {
    let prev = approved;
    let n = prev === "pending" ? "active" : prev === "active" ? "inactive" : prev === "inactive" ? "active" : "inactive"
    const res = await axios.post("https://newshive-express-1.onrender.com/newsStatus",{id:news._id ,status:n});
    if(res.status == 200)
    {
      setApproved(n);
      onUpdate(news._id,n);
    }
    
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(44, 36, 36, 0.3)" }}
    >
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl relative shadow-lg overflow-auto max-h-screen">
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
        <p
          className="text-gray-700 mb-4"
          dangerouslySetInnerHTML={{ __html: news.content }}
        ></p>

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
          {isEditor && 
          <button
            onClick={toggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-xl backdrop-blur-md bg-opacity-80 transition-all duration-300 transform hover:scale-105 active:scale-95 ${bg} ${textColor}`}
          >
            {icon}
            <span className="font-semibold tracking-wide">{text}</span>
          </button>}
        </div>
      </div>
    </div>
  );
};

export default NewsOverlay;
